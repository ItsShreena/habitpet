import { useEffect, useState } from "react"
import quotes from "./data/quotes"
import rewards from "./data/rewards"

import { motion } from "framer-motion"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import Confetti from "react-confetti"

import {
  FaFire,
  FaTrophy,
  FaMoon,
  FaSun,
  FaCheckCircle,
} from "react-icons/fa"

function Dashboard() {

  // STATES
  const [habits, setHabits] = useState([])
  const [input, setInput] = useState("")

  const [xp, setXp] = useState(0)

  const [darkMode, setDarkMode] = useState(true)

  const [timeLeft, setTimeLeft] = useState(1500)
  const [isRunning, setIsRunning] = useState(false)

  const [sessions, setSessions] = useState(0)

  const [streak, setStreak] = useState(0)

  const [showAchievement, setShowAchievement] =
    useState(false)

  // RANDOM QUOTE
  const randomQuote =
    quotes[Math.floor(Math.random() * quotes.length)]

  // LOAD DATA
  useEffect(() => {

    const savedHabits =
      JSON.parse(localStorage.getItem("habits")) || []

    const savedXP =
      JSON.parse(localStorage.getItem("xp")) || 0

    const savedStreak =
      JSON.parse(localStorage.getItem("streak")) || 0

    setHabits(savedHabits)
    setXp(savedXP)
    setStreak(savedStreak)

  }, [])

  // SAVE DATA
  useEffect(() => {

    localStorage.setItem(
      "habits",
      JSON.stringify(habits)
    )

    localStorage.setItem(
      "xp",
      JSON.stringify(xp)
    )

    localStorage.setItem(
      "streak",
      JSON.stringify(streak)
    )

  }, [habits, xp, streak])

  // POMODORO
  useEffect(() => {

    let timer

    if (isRunning && timeLeft > 0) {

      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)

    }

    if (timeLeft === 0) {

      setIsRunning(false)

      setXp((prev) => prev + 25)

      setSessions((prev) => prev + 1)

      setShowAchievement(true)

      setTimeout(() => {
        setShowAchievement(false)
      }, 3000)

      alert("Pomodoro Complete! +25 XP 🍅")

      setTimeLeft(1500)
    }

    return () => clearInterval(timer)

  }, [isRunning, timeLeft])

  // ADD HABIT
  function addHabit() {

    if (input.trim() === "") return

    const newHabit = {
      id: Date.now(),
      text: input,
      completed: false,
    }

    setHabits([...habits, newHabit])

    setInput("")
  }

  // COMPLETE HABIT
  function completeHabit(id) {

    const updatedHabits = habits.map((habit) => {

      if (habit.id === id && !habit.completed) {

        setXp((prev) => prev + 10)

        setStreak((prev) => prev + 1)

        return {
          ...habit,
          completed: true,
        }
      }

      return habit
    })

    setHabits(updatedHabits)
  }

  // DELETE HABIT
  function deleteHabit(id) {

    const filtered = habits.filter(
      (habit) => habit.id !== id
    )

    setHabits(filtered)
  }

  // FORMAT TIMER
  function formatTime(seconds) {

    const mins = Math.floor(seconds / 60)

    const secs = seconds % 60

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  // LEVEL
  const level = Math.floor(xp / 100) + 1

  const progress = xp % 100

  // CHART DATA
  const chartData = [
    {
      name: "XP",
      value: xp,
    },
    {
      name: "Sessions",
      value: sessions,
    },
    {
      name: "Streak",
      value: streak,
    },
  ]

  return (

    <div
      className={`min-h-screen transition-all duration-500 p-6
      ${
        darkMode
          ? "bg-zinc-950 text-white"
          : "bg-zinc-100 text-black"
      }`}
    >

      {/* CONFETTI */}
      {showAchievement && <Confetti />}

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">

        <h1 className="text-4xl font-bold">
          HabitPet 🐾
        </h1>

        <div className="flex gap-3 mt-4 md:mt-0">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-purple-500 px-5 py-2 rounded-xl text-white"
          >

            <div className="flex items-center gap-2">

              {darkMode
                ? <FaSun />
                : <FaMoon />}

              {darkMode
                ? "Light Mode"
                : "Dark Mode"}

            </div>

          </button>

          <button className="bg-pink-500 px-5 py-2 rounded-xl text-white">
            Login
          </button>

        </div>

      </div>

      {/* ACHIEVEMENT */}
      {showAchievement && (

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50"
        >
          Achievement Unlocked 🏆
        </motion.div>

      )}

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* PET */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          className="bg-zinc-900 rounded-2xl p-6"
        >

          <h2 className="text-2xl font-semibold mb-4">
            Your Pet
          </h2>

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="text-7xl text-center"
          >

            {level >= 10
              ? "🐲"
              : level >= 7
              ? "🦊"
              : level >= 5
              ? "🐯"
              : level >= 3
              ? "🐱"
              : "🥚"}

          </motion.div>

          <p className="text-center mt-4 text-green-400">
            Level {level}
          </p>

          <p className="text-center text-zinc-400 mt-2">

            {level >= 10
              ? "Legendary Pet"
              : level >= 7
              ? "Epic Pet"
              : level >= 5
              ? "Advanced Pet"
              : level >= 3
              ? "Baby Pet"
              : "Egg Form"}

          </p>

        </motion.div>

        {/* XP */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-zinc-900 rounded-2xl p-6"
        >

          <h2 className="text-2xl font-semibold mb-4">
            Level Progress
          </h2>

          <p className="mb-2">
            Level {level}
          </p>

          <div className="w-full bg-zinc-700 rounded-full h-5">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-green-500 h-5 rounded-full"
            />

          </div>

          <p className="mt-2 text-sm text-zinc-400">
            {progress}/100 XP
          </p>

        </motion.div>

        {/* QUOTE */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-zinc-900 rounded-2xl p-6"
        >

          <h2 className="text-2xl font-semibold mb-4">
            Daily Quote
          </h2>

          <p className="italic text-zinc-300">
            {randomQuote}
          </p>

        </motion.div>

      </div>

      {/* HABITS + TIMER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* HABITS */}
        <div className="bg-zinc-900 rounded-2xl p-6">

          <h2 className="text-2xl font-semibold mb-4">
            Today's Habits
          </h2>

          <div className="flex gap-3 mb-4">

            <input
              type="text"
              placeholder="Add habit..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-zinc-800 outline-none"
            />

            <button
              onClick={addHabit}
              className="bg-green-500 px-5 rounded-xl"
            >
              Add
            </button>

          </div>

          {/* EMPTY STATE */}
          {habits.length === 0 && (

            <div className="text-center text-zinc-500 py-10">
              No habits yet. Add one 🚀
            </div>

          )}

          <div className="space-y-3">

            {habits.map((habit) => (

              <motion.div
                key={habit.id}
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center"
              >

                <span
                  className={
                    habit.completed
                      ? "line-through text-zinc-500"
                      : ""
                  }
                >
                  {habit.text}
                </span>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      completeHabit(habit.id)
                    }
                    className="bg-green-500 px-3 py-1 rounded-lg"
                  >
                    Done
                  </button>

                  <button
                    onClick={() =>
                      deleteHabit(habit.id)
                    }
                    className="bg-red-500 px-3 py-1 rounded-lg"
                  >
                    X
                  </button>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        {/* TIMER */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-zinc-900 rounded-2xl p-6"
        >

          <h2 className="text-2xl font-semibold mb-4">
            Focus Timer 🍅
          </h2>

          <div className="text-6xl font-bold text-center mb-6">
            {formatTime(timeLeft)}
          </div>

          <p className="text-center text-zinc-400 mb-4">
            Sessions Completed: {sessions}
          </p>

          <div className="flex justify-center gap-4">

            <button
              onClick={() => setIsRunning(true)}
              className="bg-green-500 px-5 py-2 rounded-xl"
            >
              Start
            </button>

            <button
              onClick={() => setIsRunning(false)}
              className="bg-yellow-500 px-5 py-2 rounded-xl"
            >
              Pause
            </button>

            <button
              onClick={() => {
                setIsRunning(false)
                setTimeLeft(1500)
              }}
              className="bg-red-500 px-5 py-2 rounded-xl"
            >
              Reset
            </button>

          </div>

        </motion.div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <div className="bg-zinc-900 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaTrophy />
            Total XP
          </h2>

          <p className="text-4xl font-bold text-green-400">
            {xp}
          </p>

        </div>

        <div className="bg-zinc-900 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaFire />
            Streak
          </h2>

          <p className="text-4xl font-bold text-orange-400">
            {streak}
          </p>

        </div>

        <div className="bg-zinc-900 rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaCheckCircle />
            Sessions
          </h2>

          <p className="text-4xl font-bold text-yellow-400">
            {sessions}
          </p>

        </div>

      </div>

      {/* CHART */}
      <div className="mt-6 bg-zinc-900 rounded-2xl p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Analytics 📊
        </h2>

        <div className="h-72">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={chartData}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* REWARDS */}
      <div className="mt-6 bg-zinc-900 rounded-2xl p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Rewards 🏆
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {rewards.map((reward) => {

            const unlocked =
              level >= reward.levelRequired

            return (

              <motion.div
                whileHover={{ scale: 1.03 }}
                key={reward.id}
                className={`p-5 rounded-2xl border transition-all
                ${
                  unlocked
                    ? "bg-green-500/20 border-green-500"
                    : "bg-zinc-800 border-zinc-700 opacity-50"
                }`}
              >

                <div className="text-5xl mb-3">
                  {reward.icon}
                </div>

                <h3 className="text-xl font-bold">
                  {reward.name}
                </h3>

                <p className="text-sm mt-2 text-zinc-300">
                  Unlocks at Level {reward.levelRequired}
                </p>

                <p className="mt-3 font-semibold">

                  {unlocked
                    ? "Unlocked ✅"
                    : "Locked 🔒"}

                </p>

              </motion.div>

            )
          })}

        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center mt-10 text-zinc-500">

        Built with ❤️ using React + Tailwind

      </div>

    </div>
  )
}

export default Dashboard
