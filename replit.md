# KLM Directory (Справочник КЛМ)

## Overview
Mobile-first employee directory app for KLM company. Loads employee data from a Google Sheets CSV, organized by departments with a hexagonal honeycomb navigation.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Express (Node.js) - serves as a proxy to fetch/parse CSV data from Google Sheets
- **No database** - data is fetched live from Google Sheets with 5-minute caching

## Data Source
Google Sheets CSV: `https://docs.google.com/spreadsheets/d/1nualyTma75WZ4eZlVuPEPMDqz94qmCx5blby-9tZCOU/export?format=csv`

### CSV Columns
0. Ф.И.О. (Full name)
1. Должность (Position title)
2. ID сотрудника (Employee code)
3. ID руководителя (Supervisor code)
4. ID отдела (Department ID: 1-8)
5. Тел. Рабочий (Work phone)
6. Тел. Личный (Personal phone)
7. Внутр. (Internal extension)
8. E-mail
9. День рождения (Birthday)
10. Фото (Photo URL)

### Department Codes
1=Администрация, 2=ВЭД, 3=Ветпрепараты, 4=Агропродукты, 5=Сырьё/Корма, 6=Кадры/Право, 7=Финансы, 8=Хозслужба

## Navigation Flow
1. **Home** - Honeycomb grid of 8 department hexagons + search bar
2. **Department** - List of employee cards in selected department
3. **Employee Detail** - Full info + action buttons (call, WhatsApp, Telegram, email) + supervisor info

## Key Files
- `shared/schema.ts` - Employee and Department types
- `shared/routes.ts` - API contract
- `server/storage.ts` - CSV fetching and parsing with caching
- `server/routes.ts` - Express API routes
- `client/src/pages/Directory.tsx` - Main page with 3-screen navigation
- `client/src/components/Hexagon.tsx` - Hexagonal button component
- `client/src/components/EmployeeCard.tsx` - Employee list card
- `client/src/components/EmployeeDetail.tsx` - Employee detail view
