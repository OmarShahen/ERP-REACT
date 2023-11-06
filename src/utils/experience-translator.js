export const experienceRateList = [
    { name: 'Very poor', number: 1 },
    { name: 'Poor', number: 2 },
    { name: 'Neutral', number: 3 },
    { name: 'Satisfied', number: 4 },
    { name: 'Very satisfied', number: 5 },
]

export const explanationRateList = [
    { name: 'Not helpful', number: 1 },
    { name: 'Unclear', number: 2 },
    { name: 'Neutral', number: 3 },
    { name: 'Yes! could be better', number: 4 },
    { name: 'Yes! very clear!', number: 5 },
] 

export const satisfactionRateList = [
    { name: 'Very dissastisfied', number: 1 },
    { name: 'Dissatisfied', number: 2 },
    { name: 'Neutral', number: 3 },
    { name: 'Satisfied', number: 4 },
    { name: 'Very satisfied', number: 5 },
]

export const healthImprovementRateList = [
    { name: 'Minimal', number: 1 },
    { name: 'Mild', number: 2 },
    { name: 'Moderate', number: 3 },
    { name: 'Significant', number: 4 },
    { name: 'Excellent', number: 5 },
]

export const getHealthImprovementNameByNumber = (number) => {

    for(let i=0;i<healthImprovementRateList.length;i++) {
        if(number === healthImprovementRateList[i].number) {
            return healthImprovementRateList[i].name
        }
    }
}

export const getExperienceNameByNumber = (number) => {

    for(let i=0;i<experienceRateList.length;i++) {
        if(number === experienceRateList[i].number) {
            return experienceRateList[i].name
        }
    }
}

export const getExplanationNameByNumber = (number) => {

    for(let i=0;i<explanationRateList.length;i++) {
        if(number === explanationRateList[i].number) {
            return explanationRateList[i].name
        }
    }
}

export const getSatisfactionNameByNumber = (number) => {

    for(let i=0;i<satisfactionRateList.length;i++) {
        if(number === satisfactionRateList[i].number) {
            return satisfactionRateList[i].name
        }
    }
}

