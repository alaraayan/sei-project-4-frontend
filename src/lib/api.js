import axios from 'axios'
import { getToken } from './auth'
import { baseUrl } from '../config.js'

function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` },
  }
}

//* SPRINT REQUESTS

export function addNewSprint(newSprintData) {
  return axios.post(`${baseUrl}/sprints/`, newSprintData, headers())
}

export function getAllSprints() {
  return axios.get(`${baseUrl}/sprints/`)
}

export function getSingleSprint(sprintId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/`)
}

// export function editSprint(id, formdata) {
//   return axios.put(`${baseUrl}/sprints/${id}`, formdata, headers())
// }

// export function deleteSprint(id) {
//   return axios.delete(`${baseUrl}/sprints/${id}`, headers())
// }

// * SPRINT GOALS REQUESTS

export function getAllSprintGoals(sprintId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/sprint-goals/`)
}
export function newSprintGoal(sprintId, formData) {
  return axios.post(
    `${baseUrl}/sprints/${sprintId}/sprint-goals/`,
    formData,
    headers()
  )
}
export function getASprintGoal(sprintId, goalId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/sprint-goals/${goalId}/`)
}
export function deleteASprintGoal(sprintId, goalId) {
  return axios.delete(`${baseUrl}/sprints/${sprintId}/sprint-goals/${goalId}/`)
}
export function editASprintGoal(sprintId, goalId, formData) {
  return axios.put(
    `${baseUrl}/sprints/${sprintId}/sprint-goals/${goalId}/`,
    formData,
    headers()
  )
}

// * SPRINT HABIT REQUESTS

export function getAllSprintHabits(sprintId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/sprint-habits/`)
}
export function newSprintHabit(sprintId, formData) {
  return axios.post(
    `${baseUrl}/sprints/${sprintId}/sprint-habits/`,
    formData,
    headers()
  )
}
export function getASprintHabit(sprintId, habitId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/sprint-habits/${habitId}/`)
}
export function deleteASprintHabit(sprintId, habitId) {
  return axios.delete(
    `${baseUrl}/sprints/${sprintId}/sprint-habits/${habitId}/`
  )
}
export function editASprintHabit(sprintId, habitId, formData) {
  return axios.put(
    `${baseUrl}/sprints/${sprintId}/sprint-habits/${habitId}/`,
    formData,
    headers()
  )
}

//* WEEKLY INTENTION REQUESTS

export function getAllWeeklyIntentions(sprintId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/intentions/`)
}
export function newWeeklyIntention(sprintId, formData) {
  return axios.post(
    `${baseUrl}/sprints/${sprintId}/intentions/`,
    formData,
    headers()
  )
}
export function editAWeeklyIntention(sprintId, intentionId, formData) {
  return axios.put(
    `${baseUrl}/sprints/${sprintId}/intentions/${intentionId}/`,
    formData,
    headers()
  )
}
//Don't need these unless we change the functionality, weekly intentions cannot be deleted manually.
// export function getAWeeklyIntention(sprintId, intentionId) {
//   return axios.get(`${baseUrl}/sprints/${sprintId}/intentions/${intentionId}/`)
// }
// export function deleteAWeeklyIntention(sprintId, intentionId) {
//   return axios.delete(
//     `${baseUrl}/sprints/${sprintId}/intentions/${intentionId}/`
//   )
// }

//* DAILY GRATITUDE REQUESTS

export function getAllDailyGratitudes(sprintId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/gratitudes/`)
}
export function newDailyGratitude(sprintId, formData) {
  return axios.post(
    `${baseUrl}/sprints/${sprintId}/gratitudes/`,
    formData,
    headers()
  )
}
export function getADailyGratitude(sprintId, gratitudeId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/gratitudes/${gratitudeId}/`)
}
export function deleteADailyGratitude(sprintId, gratitudeId) {
  return axios.delete(
    `${baseUrl}/sprints/${sprintId}/gratitudes/${gratitudeId}/`
  )
}
export function editADailyGratitude(sprintId, gratitudeId, formData) {
  return axios.put(
    `${baseUrl}/sprints/${sprintId}/gratitudes/${gratitudeId}/`,
    formData,
    headers()
  )
}
//* DAILY TO-DO REQUESTS

export function getAllDailyToDos(sprintId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/to-dos/`)
}
export function newDailyToDo(sprintId, formData) {
  return axios.post(
    `${baseUrl}/sprints/${sprintId}/to-dos/`,
    formData,
    headers()
  )
}
export function getADailyToDo(sprintId, toDoId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/to-dos/${toDoId}/`)
}
export function deleteADailyToDo(sprintId, toDoId) {
  return axios.delete(`${baseUrl}/sprints/${sprintId}/to-dos/${toDoId}/`)
}
export function editADailyToDo(sprintId, toDoId, formData) {
  return axios.put(
    `${baseUrl}/sprints/${sprintId}/to-dos/${toDoId}/`,
    formData,
    headers()
  )
}

// * DAILY MOOD REQUESTS

export function addMoods(sprintId, moodName) {
  return axios.post(
    `${baseUrl}/sprints/${sprintId}/moods/`,
    { moodName },
    headers()
  )
}

export function getCurrentMoods(sprintId) {
  return axios.get(`${baseUrl}/sprints/${sprintId}/moods/`)
}

export function deleteMood(sprintId, moodId) {
  return axios.delete(
    `${baseUrl}/sprints/${sprintId}/moods/${moodId}/`,
    headers()
  )
}

//* DAILY ENERGY REQUESTS

export function addEnergyLevel(sprintId, energyLevel) {
  return axios.post(
    `${baseUrl}/sprints/${sprintId}/energy-levels/`,
    { energyLevel },
    headers()
  )
}

// * AUTH / USER REQUESTS

export function registerUser(formData) {
  console.log(formData)
  console.log(baseUrl)
  return axios.post(`${baseUrl}/auth/register/`, formData)
}

export function loginUser(formData) {
  return axios.post(`${baseUrl}/auth/login/`, formData)
}

export function getUser(userId) {
  return axios.get(`${baseUrl}/auth/profile/${userId}/`)
}
export function getUserWithReset(userId) {
  return axios.put(`${baseUrl}/auth/profile/${userId}/reset/`)
}
