# import geojson
import datetime
import matplotlib.colors as colors


class Parameters:
    def __init__(self, val, title, description):
        self.val = val
        self.title = title
        self.description = description

    def export_signature(self):
        return {
            'type': 'default',
            'title': self.title,
            'description': self.description
        }


class Int(Parameters):
    def __init__(self, title, description, min_val=0, max_val=100, val=0):
        super().__init__(val, title, description)
        self.min = min_val
        self.max = max_val

    def export_signature(self):
        return {
            "type": "int",
            "title": self.title,
            "description": self.description,
            "min": self.min,
            "max": self.max,
        }


class Float(Parameters):
    def __init__(self, title, description, val=0.0, min_val=0.0, max_val=1.0):
        super().__init__(val, title, description)
        self.min = min_val
        self.max = max_val

    def export_signature(self):
        return {
            "type": "float",
            "title": self.title,
            "description": self.description,
            "min": self.min,
            "max": self.max,
        }


class String(Parameters):
    def __init__(self,title, description,  val=''):
        super().__init__(val,title, description)

    def export_signature(self):
        return {
            "type": "string",
            "title": self.title,
            "description": self.description,
        }


class GeoJson(Parameters):
    def __init__(self, title, description, val=None):
        super().__init__(val, title, description)

    def export_signature(self):
        return {
            "type": "geojson",
            "title": self.title,
            # "val": self.val,
            "description": self.description,
        }


class TimeStamp(Parameters):
    def __init__(self, title, description, val=datetime.datetime.now()):
        super().__init__(val, title, description)

    def export_signature(self):
        return {
            "type": "timestamp",
            "title": self.title,
            "description": self.description,
        }


class Boolean(Parameters):
    def __init__(self, title, description, val=False):
        super().__init__(val, title, description)

    def export_signature(self):
        return {
            "type": "boolean",
            "title": self.title,
            "description": self.description,
        }


class ChoiceList(Parameters):
    def __init__(self, title, description, val=0, choices=None):
        super().__init__(val, title, description)
        if choices is None:
            choices = []
        self.choices = choices

    def export_signature(self):
        return {
            "type": "choicelist",
            "title": self.title,
            "description": self.description,
            "choices": self.choices
        }


class Color(Parameters):
    def __init__(self, title, description, val=colors.BASE_COLORS['w']):
        super().__init__(val, title, description)

    def export_signature(self):
        return {
            "type": "color",
            "title": self.title,
            "description": self.description,
        }
