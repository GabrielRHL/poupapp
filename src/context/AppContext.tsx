/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"
import { ITransacoes, IUsuario } from "../types"
import { criarTransacoes, criarUsuario, obterTransacoes, obterUsuario } from "../api"

interface AppContextType {
    usuario: IUsuario | null
    criaUsuario: (usuario: Omit<IUsuario, 'id'>) => Promise<void>
    transacoes: ITransacoes[]
    criaTransacao: (transacao: Omit<ITransacoes, 'id'>) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({children}: {children: React.ReactNode}) => {
    const [usuario, setUsuario]= useState<IUsuario | null>(null)
    const [transacoes, setTransacoes]= useState<ITransacoes[]>([])

    const carregarDadosUsuario = async () => {
        try {
            const usuarios = await obterUsuario()
            const transacoes = await obterTransacoes()
            if (usuarios.length > 0) {
                setUsuario(usuarios[0])
                setTransacoes(transacoes)
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

    const criaTransacao = async (novaTransacao: Omit<ITransacoes, 'id'>) => {
        try {
            const transacaoCriada = await criarTransacoes(novaTransacao)
            setTransacoes((prev) => [...prev, transacaoCriada])
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AppContext.Provider value={{usuario, criaUsuario, transacoes, criaTransacao}}>
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