import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://hmfpugfigzyvomyhclqp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtZnB1Z2ZpZ3p5dm9teWhjbHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyMzk2MzMsImV4cCI6MjAzNjgxNTYzM30.kit9wnyINDfjgoZndmWb7Z4qHxx9nJYH4o0Cbtb24iw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
