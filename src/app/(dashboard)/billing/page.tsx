'use client'

import { CreditCard, Check } from 'lucide-react'

export default function BillingPage() {
    return (
        <div className="h-full p-8 overflow-auto">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Pagamento</h1>
                    <p className="text-slate-600 mt-2">Gerencie sua assinatura e métodos de pagamento</p>
                </div>

                {/* Current Plan */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-8 mb-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Plano Atual</p>
                            <h2 className="text-3xl font-bold">Gratuito</h2>
                            <p className="text-blue-100 mt-2">Crie até 3 propostas por mês</p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <CreditCard className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                {/* Upgrade Plans */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Pro Plan */}
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 hover:border-blue-500 transition-colors">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Pro</h3>
                            <div className="mt-2">
                                <span className="text-4xl font-bold text-slate-900">R$ 97</span>
                                <span className="text-slate-600">/mês</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                Propostas ilimitadas
                            </li>
                            <li className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                AI Consultant avançado
                            </li>
                            <li className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                Closing Kit completo
                            </li>
                            <li className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                Suporte prioritário
                            </li>
                        </ul>
                        <button className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
                            Fazer Upgrade
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white rounded-xl border-2 border-blue-500 p-6 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                            POPULAR
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
                            <div className="mt-2">
                                <span className="text-4xl font-bold text-slate-900">R$ 297</span>
                                <span className="text-slate-600">/mês</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                Tudo do Pro
                            </li>
                            <li className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                White label
                            </li>
                            <li className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                API access
                            </li>
                            <li className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-500" />
                                Suporte dedicado
                            </li>
                        </ul>
                        <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                            Fazer Upgrade
                        </button>
                    </div>
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Histórico de Pagamentos</h3>
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600">Nenhum pagamento registrado</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
