const axios = require('axios');

exports.handler = async (event, context) => {
  // Only process POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse form data
    const formData = new URLSearchParams(event.body);
    const data = Object.fromEntries(formData);
    
    console.log('Form submission received:', data);
    
    // Skip if honeypot is filled (spam)
    if (data['bot-field']) {
      console.log('Spam detected - bot field filled');
      return { statusCode: 200, body: 'Spam detected' };
    }

    // Get form configuration
    const formConfig = getFormConfig(data['form-type'], data['service']);
    console.log('Form config:', formConfig);
    
    // Prepare Brevo contact data
    const brevoContact = {
      email: data.email,
      attributes: {
        FIRSTNAME: data.name ? data.name.split(' ')[0] : '',
        LASTNAME: data.name ? data.name.split(' ').slice(1).join(' ') : '',
        COMPANY: data.company || '',
        JOB_TITLE: data['job-title'] || '',
        SERVICE_TIER: formConfig.serviceTier,
        INQUIRY_DETAILS: data.urgency || data.message || data['urgency-details'] || '',
        LEAD_SOURCE: data['lead-source'] || 'Website',
        LEAD_SCORE: formConfig.leadScore
      },
      listIds: [formConfig.listId],
      updateEnabled: true
    };

    console.log('Sending to Brevo:', brevoContact);

    // Send to Brevo
    const response = await axios.post(
      'https://api.brevo.com/v3/contacts',
      brevoContact,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        }
      }
    );

    console.log('Brevo response:', response.data);

    // Send emergency notification if needed
    if (data['form-type'] === 'emergency') {
      await sendEmergencyNotification(data);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Contact added successfully',
        brevoResponse: response.data 
      })
    };

  } catch (error) {
    console.error('Brevo webhook error:', error.response?.data || error.message);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process form submission',
        details: error.response?.data || error.message
      })
    };
  }
};

function getFormConfig(formType, serviceInterest) {
  // Default configuration
  let config = {
    listId: 8, // General Inquiries list ID
    serviceTier: 'Standard',
    leadScore: 25
  };

  // Emergency forms get high priority
  if (formType === 'emergency') {
    config = {
      listId: 3, // Emergency Assessment Prospects list ID
      serviceTier: 'Emergency',
      leadScore: 75
    };
  }

  // High-value service interest gets higher score
  if (serviceInterest && serviceInterest.includes('emergency-assessment')) {
    config.leadScore = Math.max(config.leadScore, 60);
    config.listId = 10; // High Value Prospects list ID
  }

  return config;
}

async function sendEmergencyNotification(data) {
  try {
    const notificationData = {
      to: [{ 
        email: 'your-email@ailexconsulting.com', // Replace with your actual email
        name: 'AiLex Emergency Alert'
      }],
      subject: '🚨 URGENT: Emergency AI Act Request - Response Required',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #dc2626;">🚨 Emergency AI Act Assessment Request</h2>
          
          <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <strong style="color: #dc2626;">URGENT: Respond within 1 hour</strong>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.company}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Role:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data['job-title'] || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Urgency Level:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data['urgency-level'] || 'Not specified'}</td></tr>
          </table>
          
          <div style="margin: 20px 0;">
            <h3>Details:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${data.urgency || data['urgency-details'] || 'No details provided'}</p>
          </div>
          
          <div style="background: #dc2626; color: white; padding: 15px; text-align: center; border-radius: 5px;">
            <strong>Action Required: Contact within 1 hour</strong><br>
            <small>Form: ${data['form-name']} | Time: ${new Date().toLocaleString()}</small>
          </div>
        </div>
      `
    };

    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      notificationData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY
        }
      }
    );

    console.log('Emergency notification sent successfully');
  } catch (error) {
    console.error('Failed to send emergency notification:', error.response?.data || error.message);
  }
}