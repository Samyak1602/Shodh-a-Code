-- Insert sample contest
INSERT INTO contests (id, title, description, start_time, end_time) VALUES 
(1, 'Shodh Sample Contest', 'A sample coding contest to test the platform', 
 DATEADD('HOUR', -1, CURRENT_TIMESTAMP), 
 DATEADD('HOUR', 2, CURRENT_TIMESTAMP));

-- Insert sample problems
INSERT INTO problems (id, title, statement, contest_id) VALUES 
(1, 'Sum Two Numbers', 'Given two integers a and b, output their sum.', 1),
(2, 'Echo Input', 'Read a line of input and output it exactly as given.', 1);

-- Insert test cases for Sum Two Numbers
INSERT INTO test_cases (problem_id, input, expected_output) VALUES 
(1, '2 3', '5'),
(1, '10 20', '30'),
(1, '-5 3', '-2');

-- Insert test cases for Echo Input
INSERT INTO test_cases (problem_id, input, expected_output) VALUES 
(2, 'Hello World', 'Hello World'),
(2, 'Shodh-a-Code', 'Shodh-a-Code'),
(2, '123', '123');
