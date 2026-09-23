export function checkEligibility(user, scheme) {
    const criteria_checked = [];
    let isEligible = true;

    // Age Checks
    if (scheme.min_age !== null && scheme.min_age !== undefined) {
        const passed = user.age >= scheme.min_age;
        criteria_checked.push({ field: "Age", operator: ">=", threshold: scheme.min_age, user_value: user.age, passed });
        if (!passed) isEligible = false;
    }
    if (scheme.max_age !== null && scheme.max_age !== undefined) {
        const passed = user.age <= scheme.max_age;
        criteria_checked.push({ field: "Age", operator: "<=", threshold: scheme.max_age, user_value: user.age, passed });
        if (!passed) isEligible = false;
    }

    // Gender Check
    if (scheme.target_gender) {
        const passed = user.gender?.toLowerCase() === scheme.target_gender.toLowerCase();
        criteria_checked.push({ field: "Gender", operator: "==", threshold: scheme.target_gender, user_value: user.gender, passed });
        if (!passed) isEligible = false;
    }

    // Income Check (Fixed to use user.income)
    if (scheme.max_income !== null && scheme.max_income !== undefined) {
        const passed = user.income <= scheme.max_income;
        criteria_checked.push({ field: "Income", operator: "<=", threshold: scheme.max_income, user_value: user.income, passed });
        if (!passed) isEligible = false;
    }

    // State Check
    if (scheme.target_state) {
        const passed = user.state?.toLowerCase() === scheme.target_state.toLowerCase();
        criteria_checked.push({ field: "State", operator: "==", threshold: scheme.target_state, user_value: user.state, passed });
        if (!passed) isEligible = false;
    }

    // Category Check
    if (scheme.target_category) {
        const categories = scheme.target_category.split(',').map(c => c.trim().toLowerCase());
        const passed = categories.includes(user.category?.toLowerCase());
        criteria_checked.push({ field: "Category", operator: "in", threshold: scheme.target_category, user_value: user.category, passed });
        if (!passed) isEligible = false;
    }

    // Land Holding Check (Fixed to use user.land_holding)
    if (scheme.max_land_acres !== null && scheme.max_land_acres !== undefined) {
        const passed = user.land_holding <= scheme.max_land_acres;
        criteria_checked.push({ field: "Land", operator: "<=", threshold: scheme.max_land_acres, user_value: user.land_holding, passed });
        if (!passed) isEligible = false;
    }

    // Occupation Check
    if (scheme.target_occupation) {
        const passed = user.occupation?.toLowerCase() === scheme.target_occupation.toLowerCase();
        criteria_checked.push({ field: "Occupation", operator: "==", threshold: scheme.target_occupation, user_value: user.occupation, passed });
        if (!passed) isEligible = false;
    }

    // Generate Human-Readable Reason
    let reason = "";
    if (isEligible) {
        if (criteria_checked.length > 0) {
            const passedReasons = criteria_checked.map(c => `${c.field} (${c.user_value}) meets requirement`);
            reason = `Matched! ${passedReasons.join(", ")}.`;
        } else {
            reason = "Universal scheme (No strict criteria).";
        }
    } else {
        const failedReasons = criteria_checked.filter(c => !c.passed).map(c => `${c.field} (${c.user_value}) fails requirement of ${c.operator} ${c.threshold}`);
        reason = `Not eligible: ${failedReasons.join(" | ")}.`;
    }

    return { 
        isEligible, 
        reason,
        criteria_checked 
    };
}
