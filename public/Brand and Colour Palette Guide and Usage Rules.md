# Flow Networks: Brand and Colour Palette Guide and Usage Rules


## 1. Introduction & Design Principles

This document provides the complete visual and interactive design system for the Flow Networks website, including advanced animated effects. All implementations **must** adhere to these specifications for brand consistency and premium user experience.

**Core Design Principles:**
- **Dark & Sophisticated:** Professional, tech-focused aesthetic with premium polish
- 
- **Clarity & Hierarchy:** Single Root background Layer, Intentional use of color, space and motion to seperate sections. Layered perspex cards and glass cards with subtle easy lift and glow on hover effects. High contrast neon on perspex glow effects for card borders and icons. And animated attention-drawing
- **Subtle & Interactive:** Meaningful, non-intrusive animations with sophisticated effects
- **Performance Optimized:** 60fps animations with hardware acceleration

---

## 2. CORRECTED Color Palette & Usage Rules

**🚨 CRITICAL:** Colors are defined as HSL variables in `src/app/globals.css`. **Never use hard-coded hex values in components.** Use semantic class names only.

### **CORRECT Color Hierarchy:**

| Role | Color Name | HSL Variable | Hex Reference | Usage |
|------|------------|--------------|---------------|--------|
| **Foundation** | Flow Primary Teal | `--primary` | #14D8CC | Borders, structural elements, hover glows, text links |
| **Primary Action** | Flow Action Blue | `--secondary` | #0496FF | Main CTAs, primary interactive elements |
| **Accent/Highlight** | Flow Highlight Yellow | `--accent` | #FFC145 | Icons, secondary buttons, key data, premium highlights |border varient
| **Background** | Background Dark Primary | `--background` | #1c203c | Main page background |
| **Text** | Text Light | `--foreground` | #F5F0F6  | All body copy and standard text |

## **CSS:**

/* CSS HEX */
--primary: #14d8ccff;
--background: #1c203cff;
--accent: #ffc145ff;
--secondary: #0496ffff;
--foreground: #f5f0f6ff;

/* CSS HSL */
--primary: hsla(176, 83%, 46%, 1);
--background: hsla(233, 36%, 17%, 1);
--accent: hsla(40, 100%, 64%, 1);
--secondary: hsla(205, 100%, 51%, 1);
--foreground: hsla(290, 25%, 95%, 1);

/* SCSS HEX */
$primary: #14d8ccff;
$background: #1c203cff;
$accent: #ffc145ff;
$secondary: #0496ffff;
$foreground: #f5f0f6ff;

/* SCSS HSL */
$primary: hsla(176, 83%, 46%, 1);
$background: hsla(233, 36%, 17%, 1);
$accent: hsla(40, 100%, 64%, 1);
$secondary: hsla(205, 100%, 51%, 1);
$foreground: hsla(290, 25%, 95%, 1);

/* SCSS RGB */
$primary: rgba(20, 216, 204, 1);
$background: rgba(28, 32, 60, 1);
$accent: rgba(255, 193, 69, 1);
$secondary: rgba(4, 150, 255, 1);
$foreground: rgba(245, 240, 246, 1);

/* SCSS Gradient */
$gradient-top: linear-gradient(0deg, #14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);
$gradient-right: linear-gradient(90deg, #14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);
$gradient-bottom: linear-gradient(180deg, #14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);
$gradient-left: linear-gradient(270deg, #14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);
$gradient-top-right: linear-gradient(45deg, #14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);
$gradient-bottom-right: linear-gradient(135deg, #14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);
$gradient-top-left: linear-gradient(225deg, #14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);
$gradient-bottom-left: linear-gradient(315deg, #14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);
$gradient-radial: radial-gradient(#14d8ccff, #1c203cff, #ffc145ff, #0496ffff, #f5f0f6ff);


### **Detailed Color Usage Rules:**

#### **Flow Primary Teal (`--primary`)** 
- **Purpose:** Authority, Intelligence, Security, Foundation
- **Use For:**
  - Global borders on Cards and structural components
  - Global hover glows on interactive elements
  - Cursor spotlight radial glow
  - Standard text links and navigation
  - Technology icons and core solution elements
  - Mega menu icons
  - AI Chatbot UI branding

#### **Flow Action Blue (`--secondary`)**
- **Purpose:** Action, Trust, Reliability, Primary Interaction
- **Use For:**
  - Primary CTA Buttons (most important site-wide calls to action)
  - Active states in main navigation
  - Form submission buttons
  - Primary interactive elements

#### **Flow Highlight Yellow (`--accent`)**
- **Purpose:** Premium, Value, Innovation, Highlight
- **Use For:**
  - Key feature icons representing value/innovation
  - Star ratings in testimonials
  - Secondary/Tertiary buttons
  - Data visualization primary color
  - Card hover glows for special emphasis
  - Premium highlights and quality indicators

---