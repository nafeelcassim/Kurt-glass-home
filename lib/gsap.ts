"use client"

// Single registration point for GSAP + plugins so every client animator shares
// one instance and we don't re-register the plugin in every component module.
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, useGSAP, ScrollTrigger }
