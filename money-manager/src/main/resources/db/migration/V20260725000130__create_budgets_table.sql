CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    monthly_limit NUMERIC(19,2) NOT NULL,
    month VARCHAR(7) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_budget_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id),

    CONSTRAINT fk_budget_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles(id),

    CONSTRAINT uk_budget_profile_category_month UNIQUE (profile_id, category_id, month)
);

CREATE INDEX idx_budget_profile ON budgets(profile_id);

CREATE INDEX idx_budget_month ON budgets(profile_id, month);