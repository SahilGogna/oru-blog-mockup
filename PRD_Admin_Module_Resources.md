# Product Requirements Document (PRD)
## Admin Dashboard: Module-Based Resources System

---

## 1. Overview

### 1.1 Purpose
This PRD outlines the implementation of a new Module-based resource management system for the ORU admin dashboard. The system introduces an intermediate "Module" layer between Categories and Resources, allowing admins to group multiple related resources (videos and articles) into cohesive learning modules.

### 1.2 Background
Currently, the admin dashboard allows adding individual resources (videos or articles) directly under categories. This creates a flat structure that doesn't support grouping related content together. The new Module system enables better content organization and richer learning experiences.

### 1.3 Goals
- Introduce a "Module" container that can hold multiple resources
- Maintain support for Video and Article resource types only (via Link URL)
- Ensure videos always display at the top of module resources
- Create an intuitive admin interface for managing modules and resources
- Lay groundwork for future public-facing view

### 1.4 Scope
**In Scope:**
- Admin dashboard UI for creating and managing modules
- Admin dashboard UI for adding resources within modules
- Default seed data with sample modules
- Video resources automatically positioned at top

**Out of Scope:**
- Public-facing view (separate implementation)
- File uploads (CSV, PPT, etc.)
- Resource reordering/drag-and-drop functionality
- "Mark as public" toggle

---

## 2. Current System (As-Is)

### 2.1 Current Flow
```
Dashboard → Resources → Topic (e.g., "Technical Interview Prep") 
  → Category (e.g., "SQL Mock Interview") 
  → Add Resource (Video or Article via Link URL)
```

### 2.2 Current UI Components
Reference screenshots available in `images_admin/` folder showing:
- Community Resources page with topic cards layout
- Technical Interview Prep page showing category cards
- Add Resource modal with form fields and Type dropdown
- Add Resource modal showing complete form with Link URL field

### 2.3 Current Limitations
- Resources are added directly to categories with no grouping mechanism
- Cannot bundle related content (e.g., video lecture + article + practice materials)
- Flat structure makes it difficult to organize comprehensive learning paths

---

## 3. New System (To-Be)

### 3.1 New Flow
```
Dashboard → Resources → Topic (e.g., "Technical Interview Prep") 
  → Category (e.g., "SQL Mock Interview") 
  → Module (e.g., "SQL Joins Deep Dive") 
  → Resources (Video, Article)
```

### 3.2 Information Architecture

```
Topic
  └── Category
       └── Module (NEW)
            └── Resource 1 (Video - always displays first)
            └── Resource 2 (Article)
            └── Resource 3 (Video - displays after Resource 1)
            └── Resource 4 (Article)
```

---

## 4. Detailed Requirements

### 4.1 Module Management

#### 4.1.1 Module List View (Category Level)
**Location:** When admin navigates to a Category (e.g., "SQL Mock Interview")

**UI Requirements:**
- Display modules as cards (similar to current category cards layout)
- Each module card shows:
  - Module title
  - Module description (truncated if long)
  - Edit icon (pencil)
  - Delete icon (trash)
- Add "+ Add Module" button (purple, similar to existing "+ Add Resource" button)
- "← Back to Topics" breadcrumb link at top

**Visual Reference:** Similar layout to `Screenshot_2026-02-03_at_11_40_52_AM.png` but showing Modules instead of Categories

#### 4.1.2 Create Module Modal
**Trigger:** Click "+ Add Module" button

**Form Fields:**
1. **Title*** (required)
   - Text input
   - Character limit: 100 characters
   - Placeholder: "Enter module title"
   - Validation: Cannot be empty

2. **Description*** (required)
   - Textarea
   - Character limit: 250 characters
   - Placeholder: "Enter module description"
   - Validation: Cannot be empty

**Buttons:**
- "Reset" (outline button, clears form)
- "Create Module" (purple button, primary action)

**Behavior:**
- On successful creation:
  - Module is created with 0 resources
  - Modal closes
  - Admin is redirected to Module Detail View
  - Success toast: "Module created successfully"
- On cancel (X button): Modal closes, no changes saved

**Visual Reference:** Similar to `Screenshot_2026-02-03_at_11_41_59_AM.png` but with only Title and Description fields

#### 4.1.3 Edit Module
**Trigger:** Click edit (pencil) icon on module card

**Behavior:**
- Opens same modal as Create Module
- Fields pre-populated with existing data
- Button text changes to "Update Module"
- On save: Updates module, closes modal, shows success toast

#### 4.1.4 Delete Module
**Trigger:** Click delete (trash) icon on module card

**Behavior:**
- Show confirmation dialog: "Are you sure you want to delete this module? All resources within this module will also be deleted. This action cannot be undone."
- Buttons: "Cancel" (outline), "Delete" (red, primary)
- On confirm: Delete module and all associated resources
- Success toast: "Module deleted successfully"

---

### 4.2 Resource Management Within Modules

#### 4.2.1 Module Detail View
**Location:** When admin clicks into a Module

**UI Requirements:**
- Page header:
  - "← Back to Modules" breadcrumb link
  - Module title (h1)
  - Module description (subtitle, gray text)
- Action buttons (top right):
  - "+ Add Resource" (purple button)
- Resource list section:
  - If empty: Show empty state with message "No resources yet. Click 'Add Resource' to get started."
  - If resources exist: Display as cards/list items
- Each resource card shows:
  - Resource type badge (Video or Article)
  - Resource title
  - Resource description (truncated)
  - Link URL (clickable, opens in new tab)
  - Edit icon (pencil)
  - Delete icon (trash)

**Resource Ordering:**
- **Videos always display at the top**
- Within video group: order by creation date (newest first)
- Articles display below all videos
- Within article group: order by creation date (newest first)

**Visual Reference:** Create a new view inspired by the patterns in existing screenshots

#### 4.2.2 Add Resource Modal
**Trigger:** Click "+ Add Resource" button in Module Detail View

**Form Fields:**
1. **Title*** (required)
   - Text input
   - Character limit: 100 characters
   - Placeholder: "Enter resource title"

2. **Description*** (required)
   - Textarea
   - Character limit: 250 characters
   - Placeholder: "Enter resource description"

3. **Type*** (required)
   - Dropdown select
   - Options:
     - Video
     - Article
   - Placeholder: "Select type"

4. **Link URL*** (required)
   - Text input
   - Placeholder: "Enter the resource URL"
   - Validation: Must be valid URL format (https://...)

**Hidden/Auto-populated Fields:**
- Product: "Community Product" (auto-populated, not shown)
- Topic: Auto-populated from current topic (not shown)
- Category: Auto-populated from current category (not shown)
- Module: Auto-populated from current module (not shown)

**Buttons:**
- "Reset" (outline button)
- "Create Resource" (purple button, primary action)

**Behavior:**
- On successful creation:
  - Resource is added to module
  - Modal closes
  - Resource appears in appropriate position (videos at top)
  - Success toast: "Resource added successfully"

**Visual Reference:** Based on `Screenshot_2026-02-03_at_11_42_25_AM.png` but simplified (remove Product, Topic, Category dropdowns, remove "Mark as public" toggle)

#### 4.2.3 Edit Resource
**Trigger:** Click edit (pencil) icon on resource card

**Behavior:**
- Opens same modal as Add Resource
- Fields pre-populated with existing data
- Button text changes to "Update Resource"
- On save: Updates resource, maintains proper ordering, shows success toast

#### 4.2.4 Delete Resource
**Trigger:** Click delete (trash) icon on resource card

**Behavior:**
- Show confirmation dialog: "Are you sure you want to delete this resource? This action cannot be undone."
- Buttons: "Cancel" (outline), "Delete" (red, primary)
- On confirm: Delete resource
- Success toast: "Resource deleted successfully"

---

## 5. Technical Implementation Notes

### 5.1 Data Model

```typescript
// Module Schema
interface Module {
  id: string;
  title: string; // max 100 chars
  description: string; // max 250 chars
  categoryId: string; // foreign key
  createdAt: timestamp;
  updatedAt: timestamp;
}

// Updated Resource Schema
interface Resource {
  id: string;
  title: string; // max 100 chars
  description: string; // max 250 chars
  type: 'video' | 'article';
  linkUrl: string;
  moduleId: string; // NEW: foreign key to Module
  product: 'community_product'; // auto-populated
  topicId: string; // auto-populated
  categoryId: string; // auto-populated
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### 5.2 JavaScript Functions (Mockup)

**For this HTML mockup, implement these JavaScript functions:**

**Modules:**
```javascript
// Create/store modules
function createModule(categoryId, title, description) { }
function getModulesByCategory(categoryId) { }
function getModuleById(moduleId) { }
function updateModule(moduleId, title, description) { }
function deleteModule(moduleId) { } // Also delete associated resources
```

**Resources:**
```javascript
// Create/store resources
function createResource(moduleId, title, description, type, linkUrl) { }
function getResourcesByModule(moduleId) { } // Returns sorted array (videos first)
function updateResource(resourceId, data) { }
function deleteResource(resourceId) { }
```

**Note:** These can use localStorage or in-memory JavaScript objects/arrays. No real backend needed for mockup.

### 5.3 Resource Ordering Logic

```javascript
// Pseudo-code for resource ordering
function sortResources(resources) {
  const videos = resources
    .filter(r => r.type === 'video')
    .sort((a, b) => b.createdAt - a.createdAt);
  
  const articles = resources
    .filter(r => r.type === 'article')
    .sort((a, b) => b.createdAt - a.createdAt);
  
  return [...videos, ...articles];
}
```

### 5.4 Tech Stack & Implementation
**This is a simple mockup - keep it straightforward:**

**Required Stack:**
- **HTML5** - Standard semantic HTML
- **Tailwind CSS** - For styling (use CDN, no build process needed)
- **Vanilla JavaScript** - Basic JS for interactions (no frameworks)

**Implementation Notes:**
- Use static HTML files for each view/page
- Mock data can be hardcoded in JavaScript
- No backend/API calls needed - simulate with JavaScript functions
- Focus on demonstrating the UI flow and interactions
- LocalStorage can be used to persist data across page navigations if needed

**What to Build:**
- Simple HTML pages for: Module list view, Module detail view
- Modal components using HTML/CSS (show/hide with JS)
- Form validation with basic JavaScript
- Toast notifications (simple div with show/hide animation)
- Breadcrumb navigation (simple links between pages)

---

## 6. Default Seed Data

### 6.1 Sample Modules to Create

Please create **3 default modules** under the existing "Technical Interview Prep → SQL Mock Interview" category:

#### Module 1: "SQL Fundamentals"
- **Title:** SQL Fundamentals
- **Description:** Master the basics of SQL including SELECT statements, filtering, and sorting data.
- **Resources:**
  - Resource 1 (Video):
    - Title: "SQL SELECT Statement Explained"
    - Description: "Complete guide to writing SELECT queries with practical examples"
    - Type: Video
    - Link URL: https://youtube.com/example-sql-select

#### Module 2: "Advanced SQL Joins"
- **Title:** Advanced SQL Joins
- **Description:** Deep dive into different types of SQL joins and when to use them.
- **Resources:**
  - Resource 1 (Article):
    - Title: "Visual Guide to SQL Joins"
    - Description: "Comprehensive article with diagrams explaining INNER, LEFT, RIGHT, and FULL joins"
    - Type: Article
    - Link URL: https://example.com/sql-joins-guide

#### Module 3: "SQL Performance Optimization"
- **Title:** SQL Performance Optimization
- **Description:** Learn techniques to write efficient SQL queries and optimize database performance.
- **Resources:**
  - Resource 1 (Video):
    - Title: "SQL Query Optimization Tutorial"
    - Description: "Learn indexing, query planning, and performance tuning strategies"
    - Type: Video
    - Link URL: https://youtube.com/example-sql-optimization
  - Resource 2 (Article):
    - Title: "10 SQL Performance Tips"
    - Description: "Practical tips to improve your SQL query performance"
    - Type: Article
    - Link URL: https://example.com/sql-performance-tips

---

## 7. Success Metrics (Future)

While this is currently an admin-only mockup, here are metrics to consider when building the full system:
- Number of modules created per category
- Average resources per module
- Video vs Article resource distribution
- Admin time to create a complete module
- (Future) User engagement with module-based content vs flat resources

---

## 8. Future Considerations

### 8.1 Public View (Next Phase)
- Design public-facing module display
- Student/member resource consumption tracking
- Progress tracking within modules
- Module completion badges/certificates

### 8.2 Enhanced Features (Backlog)
- Drag-and-drop resource reordering within modules
- File upload support (PDF, PPT, CSV, etc.)
- Module templates for common topics
- Bulk import/export of modules
- Module duplication functionality
- Resource preview before saving
- Rich text editor for descriptions
- Tags/labels for better searchability

---

## 9. Design Guidelines

### 9.1 UI Consistency
- Maintain existing ORU design system (purple accent color #7C3AED)
- Use existing button styles and form components
- Keep modal designs consistent with current implementation
- Use same card layout patterns

### 9.2 User Experience
- Clear breadcrumb navigation at all levels
- Confirmation dialogs for destructive actions
- Helpful empty states with clear CTAs
- Toast notifications for all actions (success/error)
- Form validation with inline error messages
- Loading states for async operations

### 9.3 Accessibility
- Proper heading hierarchy (h1, h2, h3)
- Focus management in modals
- Keyboard navigation support
- ARIA labels for icon buttons
- Color contrast compliance

---

## 10. Acceptance Criteria

### 10.1 Module Management
- ✅ Admin can create a module with title and description
- ✅ Admin can view list of modules under a category
- ✅ Admin can edit an existing module
- ✅ Admin can delete a module (with confirmation)
- ✅ Deleting a module also deletes all associated resources

### 10.2 Resource Management
- ✅ Admin can add video resource to a module
- ✅ Admin can add article resource to a module
- ✅ Video resources automatically appear at the top
- ✅ Resources are ordered correctly (videos first, then articles, by creation date within each type)
- ✅ Admin can edit an existing resource
- ✅ Admin can delete a resource (with confirmation)

### 10.3 Data & Validation
- ✅ All required fields are validated
- ✅ Character limits are enforced
- ✅ URL validation works correctly
- ✅ Empty states display when no modules/resources exist
- ✅ Error messages are clear and helpful

### 10.4 Default Data
- ✅ 3 sample modules are created with seed data
- ✅ Sample modules contain correct mix of videos and articles
- ✅ Videos display before articles in multi-resource modules

### 10.5 Navigation & UX
- ✅ Breadcrumb navigation works at all levels
- ✅ Modals open and close correctly
- ✅ Toast notifications appear for all actions
- ✅ Confirmation dialogs prevent accidental deletions
- ✅ Page redirects work after create/update/delete actions

---

## 11. Deliverables

### For Antigravity Team:

**Simple HTML Mockup with:**
1. **HTML Pages:**
   - Module list page (shows modules under a category)
   - Module detail page (shows resources within a module)
   
2. **Interactive Components:**
   - Create/Edit Module modal (HTML + CSS + JS)
   - Create/Edit Resource modal (HTML + CSS + JS)
   - Delete confirmation dialogs
   - Toast notifications for actions
   
3. **Hardcoded Seed Data:**
   - 3 sample modules with resources (in JavaScript)
   - Data structure matching the schema in Section 5.1
   
4. **Basic Functionality:**
   - Modal open/close interactions
   - Form validation (client-side JS)
   - Add/Edit/Delete operations (update in-memory or localStorage)
   - Video-first resource ordering display
   - Breadcrumb navigation between pages

**Tech Stack:**
- HTML5 files
- Tailwind CSS (CDN link)
- Vanilla JavaScript
- No build process required

**Goal:** Demonstrate the complete admin flow so engineering team can visualize the feature before full implementation.

---

## 12. Questions for Engineering Team

Before starting implementation, please confirm:
1. Any concerns about the data model structure?
2. Timeline expectations for this mockup?
3. Should modules/resources be stored in localStorage or just use in-memory JavaScript objects?

---

## Appendix: Visual Reference

All design reference screenshots are available in the `images_admin/` folder. Use these to understand:
- Overall page layout and card structure
- Modal design patterns and form styling
- Button styles and color scheme (purple primary)
- Empty states and spacing patterns

**Key Design Elements to Reference:**
- Topic/Category card grid layout
- Modal form structure and field styling  
- Action buttons (+ Add buttons, Edit/Delete icons)
- Breadcrumb navigation style
- Form validation and character counters

---

**Document Version:** 1.0  
**Last Updated:** February 3, 2026  
**Author:** Sahil Gogna (ORU Product)  
**Status:** Ready for Development
