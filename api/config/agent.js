// config/agent.js
export const AGENT_SIGNUP_POINTS = 20;            // points an agent gets when they register
export const AGENT_COMMISSION_PER_USER = 1000;    // ₦ value of every user an agent signs up
export const AGENT_SIGNUP_SHARE = 0.1;            // 10% paid when the user signs up (verifies email)
export const AGENT_SIGNUP_AMOUNT = AGENT_COMMISSION_PER_USER * AGENT_SIGNUP_SHARE;        // ₦100
export const AGENT_ACTIVITY_AMOUNT = AGENT_COMMISSION_PER_USER - AGENT_SIGNUP_AMOUNT;     // ₦900
export const PAYOUT_COOLDOWN_DAYS = 7;            // one payout request per week