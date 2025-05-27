import { createContext, useContext, useEffect, useState } from "react"
import { IUsuario } from "../types"
import { criarUsuario, obterUsuario } from "../api"

interface AppContextType {
    usuario: IUsuario | null
    criaUsuario: (usuario: Omit<IUsuario, 'id'>) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({children}: {children: React.ReactNode}) => {
    const [usuario, setUsuario]= useState<IUsuario | null>(null)

    const carregarDadosUsuario = async () => {
        try {
            const usuarios = await obterUsuario()
            if (usuarios.length > 0) {
                setUsuario(usuarios[0])
            }
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        carregarDadosUsuario()
    })

    const criaUsuario = async (usuario: Omit<IUsuario, 'id'>) => {
        try {
            const novoUsuario = await criarUsuario(usuario)
            setUsuario(novoUsuario)
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <AppContext.Provider value={{usuario, criaUsuario}}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)

    if(!context) {
        throw new Error('useAppContext deve ser usado dentro de um Provider')
    }

    return context
}