-- Fix the amount_paid values - they should be in cents, not dollars
UPDATE no_reins_registrations
SET amount_paid = 22500
WHERE confirmation_code = 'WR-ARZPLV';

UPDATE no_reins_registrations
SET amount_paid = 37500
WHERE confirmation_code = 'WR-5ESBN9';
