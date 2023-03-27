import pandas as pd

from scopes.scope import AirliftScope


class AirliftIO(AirliftScope):
    def load_csv(path: str) -> pd.DataFrame:
        '''Load a csv file into a pandas dataframe'''
        return pd.read_csv(path)

    def equals(df1: pd.DataFrame, df2: pd.DataFrame) -> bool:
        '''Check if two dataframes are equal'''
        return df1.equals(df2)