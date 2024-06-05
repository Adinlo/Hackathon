import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from keras.models import Sequential
from keras.layers import Dense, Input
from keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from keras.utils import to_categorical
from deap import base, creator, tools, algorithms

def load_data(filepath):
    data = pd.read_csv(filepath)
    X = data.iloc[:, :-1].values  # Toutes les colonnes sauf la dernière sont des caractéristiques
    y = data.iloc[:, -1].values  # La dernière colonne est la cible
    return X, y

def preprocess_data(X, y):
    if y.dtype == 'object' or y.dtype == 'str':
        le = LabelEncoder()
        y = le.fit_transform(y)
    y = to_categorical(y)  # Conversion en one-hot encoding
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled, y_train, y_test, X.shape[1], y.shape[1]

def create_individual_toolbox(input_dim, output_dim):
    if 'FitnessMin' not in creator.__dict__:
        creator.create("FitnessMin", base.Fitness, weights=(-1.0,))
    if 'Individual' not in creator.__dict__:
        creator.create("Individual", list, fitness=creator.FitnessMin)
    
    toolbox = base.Toolbox()
    toolbox.register("attr_int", np.random.randint, 5, 13)
    toolbox.register("attr_float", np.random.uniform, -1, 1)
    
    def generate_individual(num_layers=None):
        if num_layers is None:
            num_layers = np.random.randint(1, 5)  # Nombre de couches entre 1 et 4
        structure = list(set([np.random.randint(5, 13) for _ in range(num_layers)]))  # Assurer que les valeurs ne se répètent pas
        total_weights = sum([structure[i-1] * structure[i] if i > 0 else input_dim * structure[i] for i in range(len(structure))])
        weights = [toolbox.attr_float() for _ in range(total_weights)]
        individual = structure + weights
        return creator.Individual(individual)
    
    def generate_diverse_population(n):
        population = []
        seen_structures = set()
        layer_counts = [1, 2, 3, 4]
        while len(population) < n:
            for num_layers in layer_counts:
                individual = generate_individual(num_layers)
                structure, _ = decode_individual(individual)
                structure_tuple = tuple(structure)
                if structure_tuple not in seen_structures:
                    population.append(individual)
                    seen_structures.add(structure_tuple)
                    if len(population) >= n:
                        break
        return population

    toolbox.register("individual", generate_individual)
    toolbox.register("population", generate_diverse_population)

    return toolbox

def decode_individual(individual):
    num_layers = len([x for x in individual if isinstance(x, int)])
    structure = individual[:num_layers]
    weights = individual[num_layers:]
    return structure, weights

def eval_nn(individual, input_dim, output_dim, X_train, y_train, X_test, y_test):
    structure, weights = decode_individual(individual)
    model = Sequential()
    model.add(Input(shape=(input_dim,)))
    total_neurons = sum(structure)
    weight_idx = 0
    for neurons in structure:
        model.add(Dense(neurons, activation='relu'))
        if weight_idx + input_dim * neurons <= len(weights):
            layer_weights = np.array(weights[weight_idx:weight_idx + input_dim * neurons]).reshape(input_dim, neurons)
            weight_idx += input_dim * neurons
            input_dim = neurons
        else:
            return (float('inf'),), 0, float('inf'), [], [], [], []  # Eviter les erreurs d'index
    model.add(Dense(output_dim, activation='softmax'))
    
    weight_idx = 0
    input_dim = X_train.shape[1]
    for layer in model.layers:
        if isinstance(layer, Dense):
            output_dim_layer = layer.units
            if weight_idx + input_dim * output_dim_layer <= len(weights):
                layer_weights = np.array(weights[weight_idx:weight_idx + input_dim * output_dim_layer]).reshape(input_dim, output_dim_layer)
                weight_idx += input_dim * output_dim_layer
                layer.set_weights([layer_weights, np.zeros(output_dim_layer)])
                input_dim = output_dim_layer
    
    model.compile(loss='categorical_crossentropy', optimizer=Adam(0.01), metrics=['accuracy'])
    history = model.fit(X_train, y_train, epochs=20, verbose=0, validation_data=(X_test, y_test))
    loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
    
    penalty = 0.01 * len(structure) + 0.001 * total_neurons
    return (loss + penalty,), accuracy, loss, history.history['accuracy'], history.history['val_accuracy'], history.history['loss'], history.history['val_loss']

def mutate_individual(individual):
    structure, weights = decode_individual(individual)
    if np.random.random() < 0.5:
        for i in range(len(structure)):
            if np.random.random() < 0.2:
                structure[i] = np.random.randint(5, 13)
    if np.random.random() < 0.5:
        weights = tools.mutPolynomialBounded(weights, low=-1, up=1, eta=0.1, indpb=0.2)[0]
    individual[:] = structure + weights
    return individual,

def mate_individuals(ind1, ind2):
    structure1, weights1 = decode_individual(ind1)
    structure2, weights2 = decode_individual(ind2)
    
    if len(structure1) != len(structure2):
        return ind1, ind2  # Pas de croisement si les structures sont différentes
    
    cxpoint = np.random.randint(1, len(ind1) - 1)
    ind1[cxpoint:], ind2[cxpoint:] = ind2[cxpoint:], ind1[cxpoint:]
    return ind1, ind2

def run_genetic_algorithm(filepath, n_population=10, n_generations=10):
    X, y = load_data(filepath)
    X_train, X_test, y_train, y_test, input_dim, output_dim = preprocess_data(X, y)
    
    toolbox = create_individual_toolbox(input_dim, output_dim)
    toolbox.register("evaluate", eval_nn, input_dim=input_dim, output_dim=output_dim, X_train=X_train, y_train=y_train, X_test=X_test, y_test=y_test)
    toolbox.register("mate", mate_individuals)
    toolbox.register("mutate", mutate_individual)
    toolbox.register("select", tools.selTournament, tournsize=3)
    
    population = toolbox.population(n=n_population)
    
    fitnesses = list(map(toolbox.evaluate, population))
    for ind, fit in zip(population, fitnesses):
        ind.fitness.values = fit[0]  # Prendre uniquement le premier élément
        ind.accuracy = fit[1]
        ind.raw_loss = fit[2]
        ind.train_accuracy = fit[3]
        ind.val_accuracy = fit[4]
        ind.train_loss = fit[5]
        ind.val_loss = fit[6]
    
    hall_of_fame = tools.HallOfFame(1)
    stats = tools.Statistics(lambda ind: ind.fitness.values)
    stats.register("min", lambda values: np.min([val[0] for val in values]))
    logbook = tools.Logbook()
    logbook.header = ["gen", "evals"] + stats.fields
    
    best_accuracy_per_gen = []
    best_loss_per_gen = []
    
    train_accuracies = []
    val_accuracies = []
    train_losses = []
    val_losses = []
    
    for gen in range(n_generations):
        if hall_of_fame:
            population.append(toolbox.clone(hall_of_fame[0]))
        
        best_individuals = tools.selBest(population, k=int(0.6 * len(population)))
        unique_best_individuals = []
        seen_structures = set()
        for ind in best_individuals:
            structure_tuple = tuple(decode_individual(ind)[0])
            if structure_tuple not in seen_structures:
                unique_best_individuals.append(ind)
                seen_structures.add(structure_tuple)
        
        worst_individuals = tools.selWorst(population, k=int(0.1 * len(population)))
        
        new_random_individuals = [toolbox.individual() for _ in range(len(population) - len(unique_best_individuals) - len(worst_individuals))]
        
        offspring = unique_best_individuals + worst_individuals + new_random_individuals
        offspring = list(map(toolbox.clone, offspring))
        
        has_one_layer = any(len(decode_individual(ind)[0]) == 1 for ind in offspring)
        has_two_layers = any(len(decode_individual(ind)[0]) == 2 for ind in offspring)
        if not has_one_layer:
            offspring.append(toolbox.individual(num_layers=1))
        if not has_two_layers:
            offspring.append(toolbox.individual(num_layers=2))
        
        for child1, child2 in zip(offspring[::2], offspring[1::2]):
            if np.random.random() < 0.5:
                toolbox.mate(child1, child2)
                del child1.fitness.values
                del child2.fitness.values
        for mutant in offspring:
            if np.random.random() < 0.2:
                toolbox.mutate(mutant)
                del mutant.fitness.values
        
        invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = map(toolbox.evaluate, invalid_ind)
        for ind, fit in zip(invalid_ind, fitnesses):
            ind.fitness.values = fit[0]  # Prendre uniquement le premier élément
            ind.accuracy = fit[1]
            ind.raw_loss = fit[2]
            ind.train_accuracy = fit[3]
            ind.val_accuracy = fit[4]
            ind.train_loss = fit[5]
            ind.val_loss = fit[6]
        
        population[:] = offspring
        
        # S'assurer que tous les individus ont des valeurs de fitness valides
        invalid_ind = [ind for ind in population if not ind.fitness.valid]
        if invalid_ind:
            fitnesses = map(toolbox.evaluate, invalid_ind)
            for ind, fit in zip(invalid_ind, fitnesses):
                ind.fitness.values = fit[0]  # Prendre uniquement le premier élément
                ind.accuracy = fit[1]
                ind.raw_loss = fit[2]
                ind.train_accuracy = fit[3]
                ind.val_accuracy = fit[4]
                ind.train_loss = fit[5]
                ind.val_loss = fit[6]
        
        # Enregistrer les statistiques
        record = stats.compile(population)
        logbook.record(gen=gen, evals=len(invalid_ind), **record)
        print(logbook.stream)
        
        hall_of_fame.update(population)
        
        best_ind = tools.selBest(population, 1)[0]
        best_accuracy_per_gen.append(best_ind.accuracy)
        best_loss_per_gen.append(best_ind.fitness.values[0])
    
        train_accuracies.append(best_ind.train_accuracy)
        val_accuracies.append(best_ind.val_accuracy)
        train_losses.append(best_ind.train_loss)
        val_losses.append(best_ind.val_loss)

        # Afficher le meilleur individu de chaque génération
        print(f"Generation {gen}: Best Individual = {best_ind}")

        # Arrêter si un modèle avec 1 couche atteint une accuracy de 98%
        for ind in population:
            structure, _ = decode_individual(ind)
            if len(structure) == 1 and ind.accuracy >= 0.98:
                print(f"Early stopping: Model with 1 layer reached 98% accuracy at generation {gen}")
                break
    
    # Affichage du meilleur individu
    best_individual = hall_of_fame[0]
    best_structure, best_weights = decode_individual(best_individual)
    best_model_layers = best_structure
    best_model = Sequential()
    best_model.add(Input(shape=(X_train.shape[1],)))
    for neurons in best_model_layers:
        best_model.add(Dense(neurons, activation='relu'))
    best_model.add(Dense(output_dim, activation='softmax'))
    best_model.compile(loss='categorical_crossentropy', optimizer=Adam(0.01), metrics=['accuracy'])
    history = best_model.fit(X_train, y_train, epochs=20, verbose=0, validation_data=(X_test, y_test))
    loss, accuracy = best_model.evaluate(X_test, y_test, verbose=0)
    return history, best_structure, best_individual.fitness.values, best_individual.accuracy,best_individual.raw_loss,loss 

filepath = 'iris.csv'  
hist, _, _, _, _,_ =  run_genetic_algorithm(filepath)
for i in hist.history:
 print(i)
