import axios from 'axios'
import { ITransacoes, IUsuario } from '../types'

const api = axios.create ({
    baseURL: 'http://localhost:3000'
})

export const obterUsuario = async (): Promise<IUsuario[]> => {
    const { data } = await api.get<IUsuario[]>('/usuarios')
    return data
}

export const criarUsuario = async (usuario: Omit<IUsuario, 'id'>): Promise<IUsuario> => {
        const usuarioComOrcamentoDiario = {
        ...usuario,
        orcamentoDiario: usuario.renda / 30
    }
    const { data } = await api.post<IUsuario>('/usuarios', usuarioComOrcamentoDiario)
    return data
}

export const atualizarUsuario = async (id: string, dados: IUsuario): Promise<IUsuario> => {
    const { data } = await api.patch(`/usuarios/${id}`, dados)
    return data
}

export const obterTransacoes = async (): Promise<ITransacoes[]> => {
    const { data } = await api.get<ITransacoes[]>('/transacoes')
    return data
}

export const criarTransacoes = async (transacoes: Omit<ITransacoes, 'id'>): Promise<ITransacoes> => {
    const { data } = await api.post<ITransacoes>('/transacoes', transacoes)
    return data
}