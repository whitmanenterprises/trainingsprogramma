import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
  'https://vwnuumzvosphqsjmzbkb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3bnV1bXp2b3NwaHFzam16YmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxODk1ODAsImV4cCI6MjA4OTc2NTU4MH0.9UA0_EKflk3k93iDdK2Gz-AjnEdlzGk3MmslNeSH3Uc'
);
