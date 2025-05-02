import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext.jsx';
import { fetchQuestions, fetchFilterOptions, fetchAvailableCount } from '../api/questionsApi.js';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';
import '../styles/pages.css';
import '../styles/HomePage.css';

const ALL_FILTER_VALUE = '__ALL__'; // Constante para "Todos"

const HomePage = () => {
    const navigate = useNavigate();
    const { startQuiz, resetQuiz } = useQuiz();

    // State
    const [filterOptions, setFilterOptions] = useState({ bloques: [], temasPorBloque: {} });
    const [selectedBloque, setSelectedBloque] = useState(ALL_FILTER_VALUE);
    const [selectedTema, setSelectedTema] = useState(ALL_FILTER_VALUE);
    const [numQuestions, setNumQuestions] = useState('10');
    const [maxQuestions, setMaxQuestions] = useState(0);
    const [isLoadingFilters, setIsLoadingFilters] = useState(true);
    const [isLoadingCount, setIsLoadingCount] = useState(false);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [error, setError] = useState(null);

    // Fetch filter options on mount
    useEffect(() => {
        resetQuiz(); // Reset quiz state on return to home
        setIsLoadingFilters(true);
        setError(null);
        fetchFilterOptions()
            .then(options => {
                setFilterOptions(options);
                // Fetch initial count for "ALL/ALL" after getting options
                return fetchAvailableCount(ALL_FILTER_VALUE, ALL_FILTER_VALUE);
            })
            .then(count => {
                setMaxQuestions(count);
            })
            .catch(err => {
                setError("Error al cargar opciones de filtro. Inténtalo de nuevo.");
                console.error("Filter/Initial Count fetch failed:", err);
            })
            .finally(() => {
                setIsLoadingFilters(false);
            });
    }, [resetQuiz]);

    // Effect to fetch max questions when filters change
    useEffect(() => {
        // Don't run if filters haven't loaded yet
        if (isLoadingFilters) return;

        setIsLoadingCount(true);
        setError(null); // Clear previous errors related to count/start
        fetchAvailableCount(selectedBloque, selectedTema)
            .then(count => {
                setMaxQuestions(count);
                // Adjust numQuestions if it exceeds the new max
                const currentNum = parseInt(numQuestions, 10);
                if (!isNaN(currentNum) && currentNum > count) {
                    setNumQuestions(count.toString());
                } else if (isNaN(currentNum) || currentNum <= 0 ) {
                    // Set to a default or the max if current is invalid
                    setNumQuestions(count > 0 ? '1' : '0'); // Start with 1 if possible
                }
            })
            .catch(err => {
                setError("Error al calcular preguntas disponibles.");
                console.error("Count fetch failed:", err);
                setMaxQuestions(0); // Set max to 0 on error
                setNumQuestions('0');
            })
            .finally(() => {
                setIsLoadingCount(false);
            });
    }, [selectedBloque, selectedTema, isLoadingFilters]); // Depend on filter selections and initial load

    // Calculate available temas based on selected bloque
    const currentTemasOptions = useMemo(() => {
        const temas = [];
        temas.push({ value: ALL_FILTER_VALUE, label: '-- TODOS LOS TEMAS --' }); // Add "ALL" option

        if (selectedBloque !== ALL_FILTER_VALUE && filterOptions.temasPorBloque[selectedBloque]) {
            filterOptions.temasPorBloque[selectedBloque].forEach(tema => {
                temas.push({ value: tema, label: tema });
            });
        }
        // If "ALL BLOQUES" is selected, only "ALL TEMAS" is shown/relevant
        return temas;
    }, [selectedBloque, filterOptions.temasPorBloque]);

    // Handlers
    const handleBloqueChange = (event) => {
        setSelectedBloque(event.target.value);
        setSelectedTema(ALL_FILTER_VALUE); // Reset tema when bloque changes
        // The useEffect for count will trigger automatically
    };

    const handleTemaChange = (event) => {
        setSelectedTema(event.target.value);
         // The useEffect for count will trigger automatically
    };

    const handleNumQuestionsChange = (event) => {
        const value = event.target.value;
         // Allow empty input temporarily, but validate on start
         setNumQuestions(value);
    };


    // Start Quiz Logic
    const handleStartQuiz = useCallback(async () => {
        setError(null);
        const limit = parseInt(numQuestions, 10);

        // Validation
        if (isNaN(limit) || limit <= 0) {
            setError("Por favor, introduce un número válido de preguntas (mayor que 0).");
            return;
        }
        if (limit > maxQuestions) {
            setError(`Solo hay ${maxQuestions} preguntas disponibles. Por favor, introduce un número menor o igual.`);
            return;
        }
         if (maxQuestions === 0) {
             setError("No hay preguntas disponibles para los filtros seleccionados.");
             return;
         }


        setIsLoadingQuestions(true);
        const config = {
            bloque: selectedBloque,
            tema: selectedTema,
            limit: limit,
        };

        try {
            const fetchedQuestions = await fetchQuestions(config);
            if (fetchedQuestions.length === 0 && maxQuestions > 0) {
                 // Should not happen if count logic is correct, but as a fallback
                 setError("No se encontraron preguntas, aunque se esperaba alguna. Intenta de nuevo.");
            } else {
                startQuiz(fetchedQuestions);
                navigate('/quiz');
            }
        } catch (err) {
            setError(`Error al obtener preguntas: ${err.message}. Inténtalo de nuevo.`);
            console.error("Quiz fetch failed:", err);
        } finally {
            setIsLoadingQuestions(false);
        }
    }, [numQuestions, maxQuestions, selectedBloque, selectedTema, navigate, startQuiz]);

    const isLoading = isLoadingFilters || isLoadingCount || isLoadingQuestions;

    return (
        <Layout>
            <div className="home-page">
                <h1>Configura tu Examen</h1>
                <p>Selecciona los filtros y el número de preguntas.</p>

                {isLoadingFilters ? (
                    <p>Cargando opciones...</p>
                ) : (
                    <div className="filter-container">
                        {/* Bloque Dropdown */}
                        <div className="filter-group">
                            <label htmlFor="bloque-select">Bloque:</label>
                            <select
                                id="bloque-select"
                                value={selectedBloque}
                                onChange={handleBloqueChange}
                                disabled={isLoading}
                            >
                                <option value={ALL_FILTER_VALUE}>-- TODOS LOS BLOQUES --</option>
                                {filterOptions.bloques.map(bloque => (
                                    <option key={bloque} value={bloque}>{bloque}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tema Dropdown */}
                        <div className="filter-group">
                            <label htmlFor="tema-select">Tema:</label>
                            <select
                                id="tema-select"
                                value={selectedTema}
                                onChange={handleTemaChange}
                                disabled={isLoading || selectedBloque === ALL_FILTER_VALUE} // Disable if ALL BLOQUES selected
                            >
                                {currentTemasOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Num Questions Input */}
                        <div className="filter-group">
                            <label htmlFor="num-questions">Número de Preguntas:</label>
                            <input
                                type="number"
                                id="num-questions"
                                value={numQuestions}
                                onChange={handleNumQuestionsChange}
                                min="1"
                                max={maxQuestions > 0 ? maxQuestions : 1} // Set max dynamically
                                step="1"
                                disabled={isLoading || maxQuestions === 0}
                            />
                            <small>
                                {isLoadingCount ? "Calculando..." : `(Máximo disponible: ${maxQuestions})`}
                            </small>
                        </div>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}

                <Button
                    onClick={handleStartQuiz}
                    disabled={isLoading || maxQuestions === 0} // Disable if loading or no questions available
                    className="start-button"
                >
                    {isLoadingQuestions ? 'Cargando...' : 'Empezar Test'}
                </Button>
            </div>
        </Layout>
    );
};

export default HomePage;