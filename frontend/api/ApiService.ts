import axios from "axios";

export class APIService{

  private _address: string;

  constructor (_address: string){
    this._address = _address;
  }

  public get address(): string {
    return this._address;
  }

  initialise = async (): Promise<void> => {
    try {
      const res = await axios.get("http://localhost:5050");
      const response = res.data;
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

}

export type KeyValue<T, U> = {
  key: T,
  value: U,
};