import axios from 'axios'
import { getToken } from './auth'
import { baseUrl } from '../config.js'

function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` },
  }
}

//* Sprint requests

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

// * DAILY MOODS

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

//* DAILY ENERGY

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
