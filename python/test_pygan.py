import numpy as np
import pandas as pd
import pygad
import pygad.nn
import pygad.gann

def fitness_func(ga_instance, solution, sol_idx):
    global GANN_instance, data_inputs, data_outputs

    if sol_idx is None:  # Adjusted to Pythonic way of checking None
        sol_idx = 1

    predictions = pygad.nn.predict(last_layer=GANN_instance.population_networks[sol_idx],
                                   data_inputs=data_inputs)
    correct_predictions = np.where(predictions == data_outputs)[0].size
    solution_fitness = (correct_predictions / data_outputs.size) * 100

    return solution_fitness

def callback_generation(ga_instance):
    global GANN_instance, last_fitness  # Include last_fitness as global

    population_matrices = pygad.gann.population_as_matrices(population_networks=GANN_instance.population_networks,
                                                            population_vectors=ga_instance.population)

    GANN_instance.update_population_trained_weights(population_trained_weights=population_matrices)

    print(f"Generation = {ga_instance.generations_completed}")
    current_fitness = ga_instance.best_solution()[1]
    change = current_fitness - (last_fitness if last_fitness is not None else 0)
    print(f"Fitness    = {current_fitness}")
    print(f"Change     = {change}")

    last_fitness = current_fitness  # Update the last_fitness at the end of each generation

def read_data(file_path):
    df = pd.read_csv(file_path)
    data_inputs = df.iloc[:, :-1].values
    data_outputs = df.iloc[:, -1].values
    return data_inputs, data_outputs

# Initialize last_fitness
last_fitness = None  # Starts as None to indicate no previous fitness recorded

data_inputs, data_outputs = read_data('Sample_Data_with_Predict_Y.csv')
num_inputs = data_inputs.shape[1]
num_classes = 2

num_solutions = 6
GANN_instance = pygad.gann.GANN(num_solutions=num_solutions,
                                num_neurons_input=num_inputs,
                                num_neurons_hidden_layers=[2],
                                num_neurons_output=num_classes,
                                hidden_activations=["relu"],
                                output_activation="softmax")

population_vectors = pygad.gann.population_as_vectors(population_networks=GANN_instance.population_networks)
initial_population = population_vectors.copy()

ga_instance = pygad.GA(num_generations=500,
                       num_parents_mating=4,
                       initial_population=initial_population,
                       fitness_func=fitness_func,
                       mutation_percent_genes=[5, 10],
                       init_range_low=-2,
                       init_range_high=5,
                       parent_selection_type="sss",
                       crossover_type="single_point",
                       mutation_type="adaptive",
                       keep_parents=1,
                       suppress_warnings=True,
                       on_generation=callback_generation)

ga_instance.run()

solution, solution_fitness, solution_idx = ga_instance.best_solution()
print(f"Parameters of the best solution : {solution}")
print(f"Fitness value of the best solution = {solution_fitness}")
print(f"Index of the best solution : {solution_idx}")

if ga_instance.best_solution_generation != -1:
    print(f"Best fitness value reached after {ga_instance.best_solution_generation} generations.")

def predict():
    predictions = pygad.nn.predict(last_layer=GANN_instance.population_networks[solution_idx],
                                   data_inputs=data_inputs)
    num_wrong = np.where(predictions != data_outputs)[0]
    num_correct = data_outputs.size - num_wrong.size
    accuracy = 100 * (num_correct / data_outputs.size)
    print(f"Predictions of the trained network : {predictions}")
    print(f"Number of correct classifications : {num_correct}")
    print(f"Number of wrong classifications : {num_wrong.size}")
    print(f"Classification accuracy : {accuracy}")
    return predictions, num_wrong, num_correct, accuracy


_,_,_,_ = predict()
