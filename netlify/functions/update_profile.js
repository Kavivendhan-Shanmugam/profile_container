const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse request body
        const updateData = JSON.parse(event.body);

        // Basic validation
        if (!updateData || typeof updateData !== 'object') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid request data' })
            };
        }

        // If Supabase is configured, update the database
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            const supabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY
            );

            // First, try to get existing profile
            const { data: existingData, error: selectError } = await supabase
                .from('profile')
                .select('*')
                .single();

            let result;

            if (existingData) {
                // Update existing profile
                result = await supabase
                    .from('profile')
                    .update({
                        ...updateData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingData.id)
                    .select()
                    .single();
            } else {
                // Insert new profile
                result = await supabase
                    .from('profile')
                    .insert({
                        ...updateData,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .select()
                    .single();
            }

            if (result.error) {
                throw result.error;
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: result.data,
                    message: 'Profile updated successfully'
                })
            };
        } else {
            // If no database is configured, just return success
            // In a real application, you might want to store this in a file or other storage
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: updateData,
                    message: 'Profile updated successfully (no database configured)'
                })
            };
        }

    } catch (error) {
        console.error('Error updating profile:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to update profile data',
                message: error.message 
            })
        };
    }
};
