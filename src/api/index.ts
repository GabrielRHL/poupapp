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

export const atualizarUsuario = async (id: number, dados: Partial<IUsuario>): Promise<IUsuario> => {
    const { data } = await api.patch(`/usuarios/${id}`, dados)
    return data
}

export const obterTransacoes = async (): Promise<ITransacoes[]> => {
    const { data } = await api.get<ITransacoes[]>('/transacoes')
    return data
}

export const criarTransacoes = async (transacao: Omit<ITransacoes, 'id'>, usuario: Omit<IUsuario, 'nome'>): Promise<ITransacoes> => {
    const transacoesComID = {...transacao, userID: usuario.id}
    const { data } = await api.post<ITransacoes>('/transacoes', transacoesComID)
    const transacoes = await obterTransacoes()
    const saldo = calcularSaldo(transacoes)
    const novoOrcamentoDiario = usuario.renda / 30 + saldo

    await atualizarUsuario(usuario.id, {
        orcamentoDiario: novoOrcamentoDiario
    }).catch((error)=>console.error(error))
    return data
}

const calcularSaldo = (transacoes: ITransacoes[]): number => {
    return transacoes.reduce((total, transacao) => {
        return transacao.tipo === 'receita' ? total + transacao.valor : total - transacao.valor
    }, 0)
}