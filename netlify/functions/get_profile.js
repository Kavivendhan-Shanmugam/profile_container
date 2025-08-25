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

    try {
        // Initialize Supabase client (only if environment variables are set)
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            const supabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY
            );

            // Get profile data from Supabase
            const { data, error } = await supabase
                .from('profile')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
                throw error;
            }

            if (data) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(data)
                };
            }
        }

        // Return default data if no database is configured or no data found
        const defaultData = {
            subtitle: "Full Stack Developer & UI/UX Designer",
            description: "Passionate about creating digital experiences that combine beautiful design with powerful functionality. I specialize in modern web technologies and user-centered design.",
            about: "I'm a passionate developer with over 3 years of experience in creating digital solutions that make a difference. My journey started with curiosity about how websites work, and it has evolved into a career focused on building exceptional user experiences.",
            projects_count: "25+",
            experience_years: "3+",
            clients_count: "15+",
            email: "kavi@example.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            contact_description: "I'm always interested in new opportunities and exciting projects. Feel free to reach out if you'd like to collaborate!"
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(defaultData)
        };

    } catch (error) {
        console.error('Error fetching profile:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch profile data',
                message: error.message 
            })
        };
    }
};
