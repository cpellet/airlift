from scopes.scope import AirliftScope
from scopes.io import AirliftIO
from flask import Flask, jsonify, Response
from flask_cors import CORS
from inspect import signature, getsource
from airlift import AirliftBlockType
from typing import List, Type


class AirliftCallableArgument:
    def __init__(self, name: str, t: str):
        self.name = name
        self.t = t

    def to_dict(self):
        return {
            'name': self.name,
            'type': self.t
        }

    def __repr__(self):
        return f'{self.name}: {self.t}'


class AirliftCallable:
    def __init__(self, name: str, module: str, doc: str, args: List[AirliftCallableArgument], return_type: str,
                 block_type: str):
        self.name = name
        self.module = module
        self.doc = doc
        self.args = args
        self.return_type = return_type
        self.block_type = block_type

    def to_dict(self):
        return {'name': self.name, 'module': self.module, 'doc': self.doc, 'args': [arg.to_dict() for arg in self.args],
                'return': self.return_type, 'type': self.block_type}

    def __repr__(self):
        return f'{self.name}({", ".join([str(arg) for arg in self.args])}) -> {self.return_type}'


def examine_scope(scope: AirliftScope):
    method_list = [method for method in dir(scope) if method.startswith('__') is False]
    return [AirliftCallable(name=method, module=scope.__module__,
                            doc=getattr(scope, method).__doc__,
                            args=[AirliftCallableArgument(name=name, t=param.annotation.__name__) for
                                  (name, param) in signature(getattr(scope, method)).parameters.items()],
                            return_type=getattr(scope, method).__annotations__['return'].__name__,
                            block_type=AirliftBlockType.FILE_INPUT.value) for method in method_list]


class AirliftBackend:

    def __init__(self, host: str, port: int, scopes: List[Type[AirliftScope]] = []):
        self.host = host
        self.port = port
        self.app = Flask(__name__)
        CORS(self.app)
        self.callables = []
        for scope in scopes:
            self.callables.extend(examine_scope(scope))
        self.app.add_url_rule('/', view_func=self.get_callables, methods=['GET'])

    def get_callables(self) -> Response:
        return jsonify([cl.to_dict() for cl in self.callables])

    def run(self):
        return self.app.run(debug=True, host=self.host, port=self.port)


if __name__ == "__main__":
    backend = AirliftBackend('localhost', 5050, [AirliftIO])
    backend.run()
