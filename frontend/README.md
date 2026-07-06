# RestoConnect Frontend


## node.js installation if needed

- Node.js (v18+)
- npm ou yarn (v11+)

### Installation on Windows

#### With Windows (PowerShell)

Option 1: Download on [nodejs.org](https://nodejs.org) and install 

Option 2: With winget (Windows Package Manager):
```powershell
winget install OpenJS.NodeJS
```

Option 3: With Chocolatey:
```powershell
choco install nodejs
```

#### With WSL (Ubuntu/Debian)
If you are using WSL, please install npm with:

```bash
sudo apt update
sudo apt install npm
```

## Installation

Install all the depencies if the project via:

```bash
npm install
```

## Launch the frontend server with this command in production

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Other Scripts

- `npm run dev` - Lauch the developpement server
- `npm run build` - Buid the application for production
- `npm start` - Start the application in production mode 
- `npm run lint` - Lauch ESLint to verify the code quality

## project stucture

```
src/
├── app/                    # Pages and layouts
│   ├── all_centers/       # Liste of all the centres
│   ├── vehicule/          # Handling the vehicules
│   ├── my_center/         # Information about your center
│   ├── equipement/        # handling the equipement of your center
│   ├── profil/            # User profil
│   ├── layout.tsx         # Main layout 
│   └── page.tsx           # Homepage
└── components/            # Components 
    └── navbar/            # Navigation bar
```

## Technologies 

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **React Hook Form** - Gestion des formulaires
- **React Query** - Gestion des données
- **Zod** - Validation de schémas
- **Chakra UI** - Composants UI

## API connection

The app connect to the backend on `http://localhost:8000`. Make sure that the backend server is runing.

## Check out for more information on

- [Documentation Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

