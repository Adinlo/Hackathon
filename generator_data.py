import pandas as pd
import numpy as np
from sklearn.datasets import make_classification


# Générateur de dataframe pour la classification
def cla_gen(lignes=10000, colonnes=10, nb_classes=30):
    max_n_informative = min(colonnes, 10)
    n_informative = min(colonnes, max_n_informative)
    n_clusters_per_class = max(1, (colonnes // nb_classes) // 2)

    X, y = make_classification(
        n_samples=lignes,
        n_features=colonnes,
        n_informative=n_informative,
        n_redundant=colonnes - n_informative,
        n_clusters_per_class=n_clusters_per_class,
        n_classes=nb_classes
    )

    for i in range(colonnes):
        X[:, i] = X[:, i] * np.random.randint(50, 150)

    df = pd.DataFrame(X, columns=[f"Col{j}" for j in range(1, X.shape[1] + 1)])
    df["y"] = pd.Series(y, name="y")

    return df


# Générateur de dataframe pour la regression
def reg_gen(lignes=10000, colonnes=6):
    temp = {}
    y = 0

    for i in range(colonnes):
        temp[f"X{i + 1}"] = np.random.rand(lignes) * np.random.randint(1, 100)

    for i in temp.values():
        y += i * np.random.randint(1, 100)

    y += np.random.randn(lignes)

    df = pd.DataFrame(temp)
    df["y"] = pd.Series(y, name="y")

    return df