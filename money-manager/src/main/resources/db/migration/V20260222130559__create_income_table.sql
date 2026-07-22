CREATE TABLE incomes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    date DATE NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    category_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_income_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_income_profile
        FOREIGN KEY (profile_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_income_profile_id ON incomes(profile_id);
CREATE INDEX idx_income_category_id ON incomes(category_id);