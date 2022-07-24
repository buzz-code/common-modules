import { getJewishDate, formatJewishDateHebrew } from 'jewish-dates-core';

function getDayFromLessonKey(lesson_key) {
    return lesson_key?.split('_')?.[2];
}

export function getDatesFromDiaryData(diaryData) {
    return Object.fromEntries(diaryData.map(({ lesson_key, lesson_date }) => ([getDayFromLessonKey(lesson_key), lesson_date])));
}

export function getSubtituteFromDiaryData(diaryData) {
    return Object.fromEntries(diaryData.map(({ lesson_key, is_substitute }) => ([getDayFromLessonKey(lesson_key), is_substitute])));
}

export function formatJewishDates(groupData) {
    for (const date in groupData.dates) {
        groupData.dates[date] = formatJewishDateHebrew(getJewishDate(new Date(groupData.dates[date])));
    }
}

export function getDaysByLessonCount(day_count, lesson_count) {
    if (!day_count) {
        return getDaysByLessonCount(lesson_count, 1);
    }

    return [...Array(day_count)]
        .map((_, dayIndex) => ({
            key: dayIndex + 1,
            lessons: [...Array(lesson_count)]
                .map((_, lessonIndex) => `lesson_date_${dayIndex + 1}_${lessonIndex + 1}`)
        }));
}

export function getNewLessonKey(lesson_key) {
    if (lesson_key?.split('_')?.length === 3) {
        return lesson_key + '_1';
    }
    return lesson_key;
}
