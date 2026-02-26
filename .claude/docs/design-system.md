# Bigtablet Design System - AI Assistant Guide

Complete reference for AI assistants to generate code using the Bigtablet Design System.

---

## Package Information

- **Package**: `@bigtablet/design-system`
- **Version**: 1.15.0+
- **Framework**: React 19 + TypeScript
- **Peer Dependencies**: `react`, `react-dom`, `lucide-react`, `react-toastify`

---

## Import Patterns

```tsx
// Pure React - use this for standard React apps
import { Button, TextField, Select, Modal, Card } from '@bigtablet/design-system';
import '@bigtablet/design-system/style.css';  // REQUIRED

// Next.js - use this when you need Sidebar (uses next/link internally)
import { Sidebar, Button } from '@bigtablet/design-system/next';
import '@bigtablet/design-system/style.css';  // REQUIRED

// Provider components - need wrapper setup
import { AlertProvider, useAlert } from '@bigtablet/design-system';
import { ToastProvider, useToast } from '@bigtablet/design-system';
```

---

## Component Quick Reference

### Standard Props (Common Across Components)

| Prop | Type | Default | Used By |
|------|------|---------|---------|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger"` | `"primary"` | Button |
| `variant` | `"outline" \| "filled" \| "ghost"` | `"outline"` | TextField, Select |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button, TextField, Select, Checkbox, Radio, Switch |
| `fullWidth` | `boolean` | varies | Button, TextField, Select, DatePicker |
| `disabled` | `boolean` | `false` | All form components |
| `className` | `string` | - | All components |

---

## Components

### Button

```tsx
import { Button } from '@bigtablet/design-system';

<Button>Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

<Button fullWidth>Full Width</Button>
<Button disabled>Disabled</Button>
```

**Props:**
- `variant`: `"primary" | "secondary" | "ghost" | "danger"` (default: `"primary"`)
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `fullWidth`: `boolean` (default: `true`)
- `width`: `string` - custom width
- `disabled`: `boolean`
- Extends `ButtonHTMLAttributes<HTMLButtonElement>`

---

### TextField

```tsx
import { TextField } from '@bigtablet/design-system';

// Basic
<TextField label="Email" placeholder="email@example.com" />

// With validation states
<TextField label="Email" error helperText="Invalid email" />
<TextField label="Username" success helperText="Available" />

// With icons (use lucide-react)
import { Search, Eye } from 'lucide-react';
<TextField leftIcon={<Search size={16} />} placeholder="Search..." />
<TextField rightIcon={<Eye size={16} />} type="password" />

// Controlled with transform
const [phone, setPhone] = useState('');
<TextField
  label="Phone"
  value={phone}
  transformValue={(v) => v.replace(/\D/g, '').slice(0, 11)}
  onChangeAction={setPhone}
/>
```

**Props:**
- `label`: `string`
- `helperText`: `string` - helper or error message
- `error`: `boolean` - error state
- `success`: `boolean` - success state
- `variant`: `"outline" | "filled" | "ghost"` (default: `"outline"`)
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `leftIcon`: `ReactNode`
- `rightIcon`: `ReactNode`
- `fullWidth`: `boolean`
- `onChangeAction`: `(value: string) => void` - value callback
- `transformValue`: `(value: string) => string` - transform input
- Extends `InputHTMLAttributes<HTMLInputElement>`

---

### Select

```tsx
import { Select, SelectOption } from '@bigtablet/design-system';

const options: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange', disabled: true },
];

// Basic
<Select
  label="Fruit"
  options={options}
  placeholder="Select..."
  onChange={(value, option) => console.log(value)}
/>

// Controlled
const [value, setValue] = useState<string | null>(null);
<Select options={options} value={value} onChange={(v) => setValue(v)} />

// Variants
<Select options={options} variant="outline" />
<Select options={options} variant="filled" />
```

**Props:**
- `options`: `SelectOption[]` - **required**
- `value`: `string | null` - controlled value
- `defaultValue`: `string | null` - uncontrolled default
- `onChange`: `(value: string | null, option: SelectOption | null) => void`
- `placeholder`: `string` (default: `"Select…"`)
- `label`: `string`
- `variant`: `"outline" | "filled" | "ghost"` (default: `"outline"`)
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `disabled`: `boolean`
- `fullWidth`: `boolean`

**SelectOption interface:**
```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

**Keyboard:** Arrow Up/Down, Enter, Escape, Home, End

---

### Checkbox

```tsx
import { Checkbox } from '@bigtablet/design-system';

<Checkbox label="Agree to terms" />

// Controlled
const [checked, setChecked] = useState(false);
<Checkbox
  label="Subscribe"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>

// Indeterminate (for "select all" pattern)
<Checkbox label="Select all" indeterminate />

// Sizes
<Checkbox size="sm" label="Small" />
<Checkbox size="md" label="Medium" />
<Checkbox size="lg" label="Large" />
```

**Props:**
- `label`: `ReactNode`
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `indeterminate`: `boolean` - partial selection state
- `checked`: `boolean` - controlled
- `disabled`: `boolean`
- Extends `InputHTMLAttributes<HTMLInputElement>`

---

### Radio

```tsx
import { Radio } from '@bigtablet/design-system';

const [selected, setSelected] = useState('opt1');

<Radio
  name="options"
  value="opt1"
  label="Option 1"
  checked={selected === 'opt1'}
  onChange={(e) => setSelected(e.target.value)}
/>
<Radio
  name="options"
  value="opt2"
  label="Option 2"
  checked={selected === 'opt2'}
  onChange={(e) => setSelected(e.target.value)}
/>
```

**Props:**
- `label`: `ReactNode`
- `name`: `string` - group name
- `value`: `string`
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `checked`: `boolean`
- `disabled`: `boolean`
- Extends `InputHTMLAttributes<HTMLInputElement>`

---

### Switch

```tsx
import { Switch } from '@bigtablet/design-system';

// Basic (ariaLabel is REQUIRED)
<Switch ariaLabel="Enable notifications" onChange={(checked) => console.log(checked)} />

// Controlled
const [on, setOn] = useState(false);
<Switch ariaLabel="Dark mode" checked={on} onChange={setOn} />

// Sizes
<Switch size="sm" ariaLabel="Small" />
<Switch size="md" ariaLabel="Medium" />
<Switch size="lg" ariaLabel="Large" />
```

**Props:**
- `ariaLabel`: `string` - **required** for accessibility
- `checked`: `boolean` - controlled
- `defaultChecked`: `boolean` - uncontrolled default
- `onChange`: `(checked: boolean) => void`
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `disabled`: `boolean`

---

### DatePicker

```tsx
import { DatePicker } from '@bigtablet/design-system';

const [date, setDate] = useState('');

// Full date (YYYY-MM-DD)
<DatePicker label="Birth Date" value={date} onChange={setDate} />

// Year-month only (YYYY-MM)
<DatePicker label="Start Month" mode="year-month" value={date} onChange={setDate} />

// With restrictions
<DatePicker
  label="Reservation"
  startYear={2020}
  endYear={2030}
  selectableRange="until-today"
  value={date}
  onChange={setDate}
/>
```

**Props:**
- `label`: `string`
- `value`: `string` - `"YYYY-MM-DD"` or `"YYYY-MM"`
- `onChange`: `(value: string) => void` - **required**
- `mode`: `"year-month" | "year-month-day"` (default: `"year-month-day"`)
- `startYear`: `number` (default: `1950`)
- `endYear`: `number` (default: current + 10)
- `selectableRange`: `"all" | "until-today"` (default: `"all"`)
- `minDate`: `string`
- `fullWidth`: `boolean` (default: `true`)
- `disabled`: `boolean`

---

### FileInput

```tsx
import { FileInput } from '@bigtablet/design-system';

<FileInput
  label="Choose File"
  accept="image/*"
  onFiles={(files) => console.log(files)}
/>

// Multiple files
<FileInput label="Upload" accept=".pdf,.doc" multiple onFiles={handleFiles} />
```

**Props:**
- `label`: `string` (default: `"파일 선택"`)
- `accept`: `string` - file types
- `onFiles`: `(files: FileList | null) => void`
- `multiple`: `boolean`
- `disabled`: `boolean`
- Extends `InputHTMLAttributes<HTMLInputElement>`

---

### Modal

```tsx
import { Modal } from '@bigtablet/design-system';

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open</button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Modal Title"
  width={600}
>
  <p>Content here</p>
  <Button onClick={() => setOpen(false)}>Close</Button>
</Modal>
```

**Props:**
- `open`: `boolean` - **required**
- `onClose`: `() => void`
- `title`: `ReactNode`
- `width`: `number | string` (default: `520`)
- `closeOnOverlay`: `boolean` (default: `true`)
- `ariaLabel`: `string`

**Features:** Focus trap, scroll lock, Escape key closes, nested modal support

---

### Card

```tsx
import { Card } from '@bigtablet/design-system';

<Card>Content</Card>
<Card heading="Title">Content with heading</Card>

// Style options
<Card shadow="none">No shadow</Card>
<Card shadow="sm">Small shadow (default)</Card>
<Card shadow="md">Medium shadow</Card>
<Card shadow="lg">Large shadow</Card>

<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding (default)</Card>
<Card padding="lg">Large padding</Card>

<Card bordered>With border</Card>
```

**Props:**
- `heading`: `ReactNode`
- `shadow`: `"none" | "sm" | "md" | "lg"` (default: `"sm"`)
- `padding`: `"none" | "sm" | "md" | "lg"` (default: `"md"`)
- `bordered`: `boolean` (default: `false`)
- Extends `HTMLAttributes<HTMLDivElement>`

---

### Alert (Provider Pattern)

```tsx
import { AlertProvider, useAlert } from '@bigtablet/design-system';

// 1. Wrap app with provider
function App() {
  return (
    <AlertProvider>
      <YourApp />
    </AlertProvider>
  );
}

// 2. Use hook anywhere inside provider
function DeleteButton() {
  const { showAlert } = useAlert();

  const handleDelete = () => {
    showAlert({
      variant: 'warning',
      title: 'Delete Item',
      message: 'Are you sure?',
      showCancel: true,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => performDelete(),
      onCancel: () => {},
    });
  };

  return <Button variant="danger" onClick={handleDelete}>Delete</Button>;
}
```

**Alert Options:**
- `variant`: `"info" | "success" | "warning" | "error"` (default: `"info"`)
- `title`: `ReactNode`
- `message`: `ReactNode`
- `confirmText`: `string` (default: `"확인"`)
- `cancelText`: `string` (default: `"취소"`)
- `showCancel`: `boolean` (default: `false`)
- `actionsAlign`: `"left" | "center" | "right"` (default: `"right"`)
- `onConfirm`: `() => void`
- `onCancel`: `() => void`

---

### Toast (Provider Pattern)

```tsx
import { ToastProvider, useToast } from '@bigtablet/design-system';

// 1. Add provider to app
function App() {
  return (
    <>
      <ToastProvider />
      <YourApp />
    </>
  );
}

// 2. Use hook
function SaveButton() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Saved successfully');
    } catch {
      toast.error('Failed to save');
    }
  };

  return <Button onClick={handleSave}>Save</Button>;
}
```

**Toast Methods:**
- `toast.success(message)` - green
- `toast.error(message)` - red
- `toast.warning(message)` - yellow
- `toast.info(message)` - blue
- `toast.message(message)` - default

---

### Spinner

```tsx
import { Spinner } from '@bigtablet/design-system';

<Spinner />                    // 24px default
<Spinner size={16} />          // small
<Spinner size={48} />          // large
<Spinner ariaLabel="Loading" /> // with accessibility label
```

**Props:**
- `size`: `number` (default: `24`) - diameter in px
- `ariaLabel`: `string`

---

### TopLoading

```tsx
import { TopLoading } from '@bigtablet/design-system';

// Indeterminate (no progress)
<TopLoading isLoading />

// With progress
<TopLoading isLoading progress={65} />

// Custom style
<TopLoading isLoading color="#ff0000" height={5} />

// Hidden
<TopLoading isLoading={false} />
```

**Props:**
- `isLoading`: `boolean` (default: `true`)
- `progress`: `number` - 0-100, undefined = indeterminate
- `color`: `string` - bar color
- `height`: `number` (default: `3`) - height in px
- `ariaLabel`: `string` (default: `"Page loading"`)

---

### Pagination

```tsx
import { Pagination } from '@bigtablet/design-system';

const [page, setPage] = useState(1);

<Pagination page={page} totalPages={20} onChange={setPage} />
```

**Props:**
- `page`: `number` - **required**, current page (1-indexed)
- `totalPages`: `number` - **required**
- `onChange`: `(page: number) => void` - **required**

---

### Sidebar (Next.js Only)

```tsx
// IMPORTANT: Import from /next
import { Sidebar } from '@bigtablet/design-system/next';
import { Home, Users, Settings } from 'lucide-react';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/users', label: 'Users', icon: Users },
  {
    type: 'group',
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { href: '/settings/profile', label: 'Profile' },
      { href: '/settings/security', label: 'Security' },
    ],
  },
];

<Sidebar
  items={items}
  activePath={pathname}
  match="startsWith"
  brandHref="/dashboard"
/>
```

**Props:**
- `items`: `SidebarItem[]` - menu items
- `activePath`: `string` - current route path
- `match`: `"startsWith" | "exact"` (default: `"startsWith"`)
- `brandHref`: `string` (default: `"/"`) - logo link
- `onItemSelect`: `(href: string) => void`
- `className`: `string`
- `style`: `CSSProperties`

**Item Types:**
```typescript
// Link item
{ href: string; label: ReactNode; icon?: LucideIcon }

// Group item
{ type: 'group'; id: string; label: ReactNode; icon?: LucideIcon; children: LinkItem[] }
```

---

## Styling

### SCSS Tokens

```scss
@use "@bigtablet/design-system/scss/token" as token;

.my-class {
  padding: token.$spacing_md;       // 0.75rem
  color: token.$color_primary;      // #000000
  border-radius: token.$radius_md;  // 8px
  box-shadow: token.$shadow_sm;
}
```

### Token Reference

**Spacing:** `$spacing_xs` (4px), `$spacing_sm` (8px), `$spacing_md` (12px), `$spacing_lg` (16px), `$spacing_xl` (20px), `$spacing_2xl` (24px)

**Colors:** `$color_primary`, `$color_primary_hover`, `$color_error`, `$color_success`, `$color_warning`, `$color_info`, `$color_text_primary`, `$color_text_secondary`, `$color_border`, `$color_background`

**Radius:** `$radius_sm` (6px), `$radius_md` (8px), `$radius_lg` (12px)

**Shadows:** `$shadow_sm`, `$shadow_md`, `$shadow_lg`

### Layout Mixins

```scss
@use "@bigtablet/design-system/scss/token" as token;

.container {
  @include token.flex_center;      // justify-content: center; align-items: center
  @include token.flex_between;     // justify-content: space-between
  @include token.flex_column;      // flex-direction: column
}
```

### Responsive Mixins

```scss
@use "@bigtablet/design-system/scss/token" as token;

.component {
  padding: token.$spacing_lg;

  @include token.mobile {
    padding: token.$spacing_sm;
  }

  @include token.tablet {
    padding: token.$spacing_md;
  }
}
```

---

## Vanilla JS (HTML/CSS/JS)

For server templates (Thymeleaf, JSP, PHP, Django):

### Setup

```html
<link rel="stylesheet" href="https://unpkg.com/@bigtablet/design-system/dist/vanilla/bigtablet.min.css">
<script src="https://unpkg.com/@bigtablet/design-system/dist/vanilla/bigtablet.min.js"></script>
```

### Class Pattern

```
.bt-{component}
.bt-{component}__{element}
.bt-{component}--{modifier}
```

### Examples

```html
<!-- Button -->
<button class="bt-button bt-button--md bt-button--primary">Primary</button>
<button class="bt-button bt-button--md bt-button--secondary">Secondary</button>
<button class="bt-button bt-button--lg bt-button--danger">Danger</button>

<!-- TextField -->
<div class="bt-text-field">
  <label class="bt-text-field__label">Email</label>
  <div class="bt-text-field__wrap">
    <input type="email" class="bt-text-field__input bt-text-field__input--outline bt-text-field__input--md">
  </div>
  <span class="bt-text-field__helper">Helper text</span>
</div>

<!-- Error state -->
<input class="bt-text-field__input bt-text-field__input--outline bt-text-field__input--md bt-text-field__input--error">
<span class="bt-text-field__helper bt-text-field__helper--error">Error message</span>

<!-- Checkbox -->
<label class="bt-checkbox">
  <input type="checkbox" class="bt-checkbox__input">
  <span class="bt-checkbox__box"></span>
  <span class="bt-checkbox__label">Label</span>
</label>

<!-- Radio -->
<label class="bt-radio">
  <input type="radio" name="group" class="bt-radio__input">
  <span class="bt-radio__dot"></span>
  <span class="bt-radio__label">Option</span>
</label>

<!-- Switch -->
<button class="bt-switch" data-bt-switch>
  <span class="bt-switch__thumb"></span>
</button>

<!-- Card -->
<div class="bt-card bt-card--bordered bt-card--p-md bt-card--shadow-sm">
  <div class="bt-card__title">Title</div>
  <p>Content</p>
</div>

<!-- Spinner -->
<div class="bt-spinner bt-spinner--md"></div>
```

### JavaScript API

```javascript
// Select
const select = Bigtablet.Select('#my-select', {
  options: [{ value: '1', label: 'One' }],
  onChange: (value) => console.log(value)
});
select.getValue();
select.setValue('1');

// Modal
const modal = Bigtablet.Modal('#my-modal', {
  closeOnOverlay: true,
  onOpen: () => {},
  onClose: () => {}
});
modal.open();
modal.close();

// Switch
const sw = Bigtablet.Switch('#my-switch', {
  onChange: (checked) => console.log(checked)
});
sw.toggle();
sw.setChecked(true);

// Alert
Bigtablet.Alert({
  title: 'Confirm',
  message: 'Are you sure?',
  variant: 'warning',
  showCancel: true,
  onConfirm: () => {},
  onCancel: () => {}
});

// Pagination
const pagination = Bigtablet.Pagination('#my-pagination', {
  page: 1,
  totalPages: 10,
  onChange: (page) => console.log(page)
});
```

---

## Common Patterns

### Form with Validation

```tsx
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await submitForm(form);
      toast.success('Submitted successfully');
    } catch {
      toast.error('Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={form.name}
        onChangeAction={(v) => setForm({ ...form, name: v })}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChangeAction={(v) => setForm({ ...form, email: v })}
        error={!!errors.email}
        helperText={errors.email}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Confirmation Dialog

```tsx
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const { showAlert } = useAlert();

  return (
    <Button
      variant="danger"
      onClick={() => {
        showAlert({
          variant: 'error',
          title: 'Delete Confirmation',
          message: 'This action cannot be undone.',
          showCancel: true,
          confirmText: 'Delete',
          onConfirm: onDelete,
        });
      }}
    >
      Delete
    </Button>
  );
}
```

### Loading State

```tsx
function DataLoader() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      await fetchData();
      toast.success('Data loaded');
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopLoading isLoading={loading} />
      <Button onClick={loadData} disabled={loading}>
        {loading ? <><Spinner size={16} /> Loading...</> : 'Load Data'}
      </Button>
    </>
  );
}
```

### Next.js Layout with Sidebar

```tsx
'use client';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@bigtablet/design-system/next';
import { Home, Users } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/users', label: 'Users', icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar items={menuItems} activePath={pathname} />
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
    </div>
  );
}
```

---

## Key Points Summary

1. **Always import CSS**: `import '@bigtablet/design-system/style.css'`
2. **Next.js Sidebar**: Import from `/next` entry point
3. **Provider setup**: AlertProvider and ToastProvider wrap your app
4. **Switch accessibility**: `ariaLabel` prop is required
5. **Size scale**: `"sm" | "md" | "lg"` consistent across components
6. **Controlled/Uncontrolled**: All form components support both patterns
7. **Vanilla JS**: Use `.bt-` prefix classes

---

## Visual Direction

- Monochrome/neutral palette with minimal accents
- Soft, quiet surfaces with subtle borders
- Emphasis through weight and spacing, not color
- Light/dark mode support with semantic color roles

## Typography (Pretendard)

- **Weights:** 300/400/500/600/700
- **Sizes:** Display (57/45/36), Headline (32/28/24), Title (22/16/14), Body (16/14/12), Label (14/12/11)
- **Line heights:** 1.2 (tight), 1.4 (normal), 1.6 (relaxed)

## Spacing (4px Grid)

- **Scale:** 0, 2, 4, 8, 12, 16, 24, 32, 48, 64
- **Screen padding:** 16 (large: 24)
- **Section gap:** 24
- **Item gap:** 12
- **Card padding:** 16 (large: 24)

## Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px
