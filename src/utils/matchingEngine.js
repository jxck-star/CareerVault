export const calculateMatchScore = (profile, job) => {
    if (!profile || !job) return { score: 0, matched: [], missing: [], reason: 'No data' };

    const applierSkills = (profile.skills || []).map(s => s.name?.toLowerCase() || "");
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());

    let matched = [];
    let missing = [];

    jobSkills.forEach(skill => {
        if (applierSkills.includes(skill)) {
            matched.push(skill);
        } else {
            missing.push(skill);
        }
    });

    // Calculate Weighted Score
    // Base skill match (70% weight)
    const skillMatchRatio = matched.length / jobSkills.length;
    let score = skillMatchRatio * 70;

    // Level alignment (20% weight)
    // Simplified: if mostly intermediate/advanced, give bonus
    const advancedSkills = (profile.skills || []).filter(s => ['Advanced', 'Expert'].includes(s.proficiency)).length;
    if (advancedSkills >= 3) score += 20;
    else if (advancedSkills >= 1) score += 10;

    // Domain/Title bonus (10% weight)
    if ((profile.experience || []).some(exp => exp.role?.toLowerCase().includes(job.title?.toLowerCase()))) {
        score += 10;
    }

    // Hard Rules
    // If missing > 50% of mandatory skills, cap score at 60
    if (skillMatchRatio < 0.5) score = Math.min(score, 60);

    return {
        score: Math.round(score),
        matched,
        missing,
        confidence: skillMatchRatio > 0.8 ? 'High' : skillMatchRatio > 0.4 ? 'Medium' : 'Low',
        reason: matched.length > 0
            ? `You have matched ${matched.length} key skills required for this role.`
            : "You are currently missing primary skills for this role."
    };
};
