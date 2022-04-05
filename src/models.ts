export interface Entry {
    date: string;
    id: string;
    title: string;
    pictureUrl: string;
    description: string;
}
export function toEntry(doc): Entry {
    return { id: doc.id, ...doc.data() };
}
export interface Challenge {
    challengeDailyFreq: number;
    challengeTitle: string;
    challengeTotal: number;
    challengeWeeklyFreq: number;
    challengeId: string,
    endDate: string;
    startDate: string;
    submissionPayout,
    totalEarned,
}
export function toChallenge(doc): Challenge {
    return { id: doc.id, ...doc.data() };
}
export interface Submission {
    day: number;
    submissionDialog: string;
    submissionId: string;
    submissionPictureUrl: string,
    submissionTime: string;
    verified: boolean;
}
export function toSubmission(doc): Submission {
        return { id: doc.id, ...doc.data() };
}

export interface User {
    accountabilityChallengesAttempted: number;
    accountabilityAge: number;
    accountabilityChallengesCompleted: number;
    accountabilityCredits: number;
    failedChallengesAccountabilityCredits: number;
    totalCreditsInvested: number;
    firstName: string,
    lastName: string,

}
export function toUser(doc): User {
    return { id: doc.id, ...doc.data() };
}
