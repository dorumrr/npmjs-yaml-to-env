export default function dotNotation(obj: any, key: any, def?: any, p?: any, udef?: any) {
	key = key.split ? key.split('.') : key;
	for (p = 0; p < key.length; p++) {
		obj = obj ? obj[key[p]] : udef;
	}
	return obj === udef ? def : obj;
}
