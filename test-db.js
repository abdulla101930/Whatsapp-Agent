require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('conversations').select('*');
  console.log("Conversations Error:", error);
  console.log("Conversations count:", data?.length);
  if (data?.length > 0) {
    console.log("Conversations:", JSON.stringify(data, null, 2));
  }

  const { data: messages, error: err2 } = await supabase.from('messages').select('*');
  console.log("Messages Error:", err2);
  console.log("Messages count:", messages?.length);
}
check();
