import { getJewishDate, formatJewishDateHebrew } from 'jewish-dates-core';

export function getDatesFromDiaryData(diaryData) {
    return Object.fromEntries(diaryData.map(({ lesson_key, lesson_date }) => ([lesson_key, lesson_date])));
}

export function getSubtituteFromDiaryData(diaryData) {
    return Object.fromEntries(diaryData.map(({ lesson_key, is_substitute }) => ([lesson_key, is_substitute])));
}

export function formatJewishDates(groupData) {
    for (const date in groupData.dates) {
        groupData.dates[date] = formatJewishDateHebrew(getJewishDate(new Date(groupData.dates[date])));
    }
}

export function getLessonsByLessonCount(lesson_count) {
    return [...Array(lesson_count)].map((_, index) => `lesson_date_${index + 1}`);
}