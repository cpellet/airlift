class Algorithm:
    def __init__(self, name, description):
        self.name = name
        self.description = description
    
    def export_signature(self):
        return {
            'name': self.name,
            'descr': self.description
        }

algos = [
    Algorithm('Auto Bus', 'Generate bus routes for an area'),
]