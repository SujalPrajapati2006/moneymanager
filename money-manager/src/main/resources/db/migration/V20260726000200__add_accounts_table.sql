CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(30) NOT NULL,
    profile_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_account_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_account_profile ON accounts(profile_id);

INSERT INTO accounts (name, type, profile_id)
SELECT 'Cash', 'cash', p.id
FROM profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM accounts a WHERE a.profile_id = p.id
);

ALTER TABLE incomes ADD COLUMN IF NOT EXISTS account_id BIGINT;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS account_id BIGINT;

UPDATE incomes i
SET account_id = (
    SELECT a.id FROM accounts a WHERE a.profile_id = i.profile_id ORDER BY a.id ASC LIMIT 1
)
WHERE i.account_id IS NULL;

UPDATE expenses e
SET account_id = (
    SELECT a.id FROM accounts a WHERE a.profile_id = e.profile_id ORDER BY a.id ASC LIMIT 1
)
WHERE e.account_id IS NULL;

ALTER TABLE incomes DROP CONSTRAINT IF EXISTS fk_income_account;
ALTER TABLE incomes ADD CONSTRAINT fk_income_account FOREIGN KEY (account_id) REFERENCES accounts(id);

ALTER TABLE expenses DROP CONSTRAINT IF EXISTS fk_expense_account;
ALTER TABLE expenses ADD CONSTRAINT fk_expense_account FOREIGN KEY (account_id) REFERENCES accounts(id);
