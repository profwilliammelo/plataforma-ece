import Link from 'next/link';
import { ArrowLeft, Check, AlertTriangle, X, Info } from 'lucide-react';

export default function NotaTecnicaPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Header */}
            <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-brand-brown font-bold text-sm transition-colors">
                        <ArrowLeft size={18} />
                        Voltar para o Início
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">EcE Lab</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">Metodologia</span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Classificação de Evidências</h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Entenda como a nossa IA e nossa equipe curam e classificam os estudos científicos que fundamentam os planejamentos na plataforma.
                    </p>
                </div>

                {/* Visual Schema Section */}
                <div className="bg-gray-50 rounded-3xl p-8 mb-16 border border-gray-100">
                    <h2 className="text-lg font-bold text-brand-brown mb-6 uppercase tracking-wider text-center">Processo de Curadoria</h2>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative">
                        {/* Step 1 */}
                        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative z-10 w-full md:w-auto">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mb-4 mx-auto md:mx-0">1</div>
                            <h3 className="font-bold text-gray-900 mb-2">Busca Intensiva</h3>
                            <p className="text-sm text-gray-500">Perguntas de pesquisa no <strong>SciSpace</strong> para varrer a literatura global.</p>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>

                        {/* Step 2 */}
                        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative z-10 w-full md:w-auto">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mb-4 mx-auto md:mx-0">2</div>
                            <h3 className="font-bold text-gray-900 mb-2">Curadoria Humana</h3>
                            <p className="text-sm text-gray-500">Classificação rigorosa de <strong>Validade, Poder e Generalização</strong>.</p>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:block w-16 h-0.5 bg-gray-300"></div>

                        {/* Step 3 */}
                        <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative z-10 w-full md:w-auto border-l-4 border-l-brand-brown">
                            <div className="w-10 h-10 bg-brand-brown text-white rounded-full flex items-center justify-center font-bold mb-4 mx-auto md:mx-0">3</div>
                            <h3 className="font-bold text-gray-900 mb-2">E-Vidente Gênio</h3>
                            <p className="text-sm text-gray-500">Apenas estudos classificados nas duas melhores classificações de cada critério (em pelo menos dois critérios) alimentam a IA.</p>
                        </div>
                    </div>
                </div>

                {/* Table 1: Validade Interna */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-sm">1</span>
                        Validade Interna
                    </h2>
                    <p className="text-gray-600 mb-6">Quão bem o desenho do estudo isola o efeito da intervenção?</p>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                <tr>
                                    <th className="p-4 w-32">Classificação</th>
                                    <th className="p-4">Quando usar</th>
                                    <th className="p-4">Exemplos típicos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="bg-green-50/50">
                                    <td className="p-4 font-bold text-green-700">🟢 Excelente</td>
                                    <td className="p-4">RCT pré-registrado, randomização robusta (inclui clusters), análise especificada, baixo risco de viés, perdas &lt;10%, medidas válidas e cegamento possível.</td>
                                    <td className="p-4 text-gray-600">RCT multicêntrico com análise multinível e protocolo público.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-yellow-600">🟡 Boa</td>
                                    <td className="p-4">RCT com pequenas fragilidades (ex.: poder moderado, algumas perdas) <strong>ou</strong> quase-experimento com controles fortes e ajuste adequado.</td>
                                    <td className="p-4 text-gray-600">RCT por turmas com 1–2 limitações; desenho de descontinuidade acentuada bem executado.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-orange-600">🟠 Moderada</td>
                                    <td className="p-4">Quase-experimento com ameaças residuais (viés de seleção provável) <strong>ou</strong> pré-pós com grupo comparação imperfeito.</td>
                                    <td className="p-4 text-gray-600">Pareamento por escore com desequilíbrios; diferenças-em-diferenças com pressupostos fracos.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-red-600">🔴 Baixa</td>
                                    <td className="p-4">Pré–pós sem controle, séries temporais curtas, análises post-hoc como base principal.</td>
                                    <td className="p-4 text-gray-600">Um grupo só; p-valores exploratórios.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-gray-800">⚫ Muito baixa</td>
                                    <td className="p-4">Evidência anedótica/qualitativa sem estratégia causal para desfechos quantitativos.</td>
                                    <td className="p-4 text-gray-600">Relatos, estudos de caso sem contrafactual.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Table 2: Poder/Precisão */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                        Poder / Precisão
                    </h2>
                    <p className="text-gray-600 mb-6">Probabilidade de detectar efeitos reais e quão estreitas são as estimativas.</p>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                <tr>
                                    <th className="p-4 w-32">Classificação</th>
                                    <th className="p-4">Quando usar</th>
                                    <th className="p-4">Regras práticas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="bg-green-50/50">
                                    <td className="p-4 font-bold text-green-700">🟢 Alta</td>
                                    <td className="p-4">Amostra grande e/ou muitos clusters; ICs estreitos; efeitos estáveis em análises sensíveis.</td>
                                    <td className="p-4 text-gray-600">≥20 clusters totais <strong>ou</strong> N≥400; IC95% não cruza nulo e é estreito.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-yellow-600">🟡 Média</td>
                                    <td className="p-4">Tamanho suficiente, mas ICs medianos; algumas análises com incerteza.</td>
                                    <td className="p-4 text-gray-600">12–19 clusters <strong>ou</strong> N≈200–399.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-orange-600">🟠 Média-baixa</td>
                                    <td className="p-4">Amostra pequena; autores reconhecem baixo poder; tendência p&lt;0,10 aparece.</td>
                                    <td className="p-4 text-gray-600">8–11 clusters <strong>ou</strong> N≈100–199; ICs largos.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-red-600">🔴 Baixa</td>
                                    <td className="p-4">Muito pouca gente/cluster; resultados instáveis.</td>
                                    <td className="p-4 text-gray-600">&lt;8 clusters <strong>ou</strong> N&lt;100; grande perda de seguimento.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Table 3: Generalização */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm">3</span>
                        Generalização
                    </h2>
                    <p className="text-gray-600 mb-6">O quão transferível é a evidência para outros contextos?</p>

                    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                <tr>
                                    <th className="p-4 w-32">Classificação</th>
                                    <th className="p-4">Quando usar</th>
                                    <th className="p-4">Indicadores</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="bg-green-50/50">
                                    <td className="p-4 font-bold text-green-700">🟢 Alta</td>
                                    <td className="p-4">Resultados replicados em múltiplos contextos/populações/doses.</td>
                                    <td className="p-4 text-gray-600">Vários países/rede; diferentes faixas etárias.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-yellow-600">🟡 Moderada</td>
                                    <td className="p-4">Alguns contextos semelhantes confirmam; poucas variações.</td>
                                    <td className="p-4 text-gray-600">2–3 redes/locais próximos.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-orange-600">🟠 Limitada</td>
                                    <td className="p-4">Contexto específico, dose/operacionalização muito particular.</td>
                                    <td className="p-4 text-gray-600">1–3 escolas, uma cidade/país; amostra específica.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-red-600">🔴 Muito limitada</td>
                                    <td className="p-4">Estudo único e altamente idiossincrático.</td>
                                    <td className="p-4 text-gray-600">1 escola/turma; requisitos raros de implementação.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
