import DeliveryService from "../services/service.js";
import { promises as fs } from "fs";
const { readFile, writeFile } = fs;

async function createOrder(req, res, next) {
	try {
		let order = req.body;
		if (!order.cliente || !order.produto || !order.valor) {
			throw new Error("Cliente, Produto e Valor are oblied.");
		}
		order = await DeliveryService.createOrder(order);
		res.send(order);
		logger.info(`POST /delivery - ${JSON.stringify(order)}`);
	} catch (err) {
		next(err);
	}
}

async function getOrders(req, res, next) {
	try {
		res.send(await DeliveryService.getOrders());
		logger.info("GET /delivery");
	} catch (err) {
		next(err);
	}
}

async function getOrder(req, res, next) {
	try {
		res.send(await DeliveryService.getOrder(req.params.id));
		logger.info(`GET /delivery/${req.params.id}`);
	} catch (err) {
		next(err);
	}
}

async function updateOrder(req, res, next) {
	try {
		const order = req.body;
		if (!order.cliente || !order.produto || !order.valor || !order.entregue) {
			throw new Error("Cliente, Produto, Valor e Entregue are oblied.");
		}
		res.send(await DeliveryService.updateOrder(order));
		logger.info(`PUT /delivery - ${JSON.stringify(order)}`);
	} catch (err) {
		next(err);
	}
}

async function updateDeliverOrder(req, res, next) {
	try {
		const order = req.body;
		// need to implement boolean validation
		if (!order.id) {
			throw new Error("Id e Entregue are oblied.");
		}
		res.send(await DeliveryService.updateDeliverOrder(order));
		logger.info(`PATCH /delivery - ${JSON.stringify(order)}`);
	} catch (err) {
		next(err);
	}
}

async function deleteOrder(req, res, next) {
	try {
		await DeliveryService.deleteOrder(req.params.id);
		res.end();
		logger.info(`DELETE /delivery/${req.params.id}`);
	} catch (err) {
		next(err);
	}
}

async function getOrderAmountPerClient(req, res, next) {
	try {
		const data = JSON.parse(await readFile("pedidos.json"));
		const clienteName = req.params.cliente;
		let amount = 0;
		data.orders.forEach((obj) => {
			if (obj.cliente === clienteName && obj.entregue === true) {
				amount += 1;
			}
		});
		res.send({ cliente: clienteName, amount: amount });
		logger.info(`GET /delivery/getOrderAmountPerClient/${req.params.cliente}`);
	} catch (err) {
		next(err);
	}
}

async function getOrderTotalValuePerClient(req, res, next) {
	try {
		const data = JSON.parse(await readFile("pedidos.json"));
		const clienteName = req.params.cliente;
		let totalValue = 0;
		data.orders.forEach((obj) => {
			if (obj.cliente === clienteName && obj.entregue === true) {
				totalValue += obj.valor;
			}
		});
		res.send({ cliente: clienteName, totalValue: totalValue });
		logger.info(`GET /delivery/OrderTotalValuePerClient/${req.params.cliente}`);
	} catch (err) {
		next(err);
	}
}

async function getProductAmount(req, res, next) {
	try {
		const data = JSON.parse(await readFile("pedidos.json"));
		const productName = req.params.produto;
		let amount = 0;
		data.orders.forEach((obj) => {
			if (obj.produto === productName && obj.entregue === true) {
				amount += 1;
			}
		});
		res.send({ produto: productName, amount: amount });
		logger.info(`GET /delivery/getProductAmount/${req.params.produto}`);
	} catch (err) {
		next(err);
	}
}

async function getProductTotalValue(req, res, next) {
	try {
		const data = JSON.parse(await readFile("pedidos.json"));
		const productName = req.params.produto;
		let totalValue = 0;
		data.orders.forEach((obj) => {
			if (obj.produto === productName && obj.entregue === true) {
				totalValue += obj.valor;
			}
		});
		res.send({ produto: productName, totalValue: totalValue });
		logger.info(`GET /delivery/getProductTotalValue/${req.params.produto}`);
	} catch (err) {
		next(err);
	}
}

async function getMostSellers(req, res, next) {
	try {
		const data = JSON.parse(await readFile("pedidos.json"));

		const delivered_products = [];
		data.orders.forEach((x) => {
			if (x.entregue === true) {
				delivered_products.push(x.produto)
			}
		});

		const product_uniques = [];
		const setArray = new Set(delivered_products);
		const result = [...setArray.values()];
		result.forEach((x) => {
			product_uniques.push({ qnt: 0, produto: x });
		});

		delivered_products.forEach((x) => {
			product_uniques.forEach((y) => {
				if (x === y.produto) {
					y.qnt++;
				}
			});
		});

		product_uniques.sort((a, b) => {
			if (a.qnt > b.qnt) {
				return -1;
			}
			if (a.qnt < b.qnt) {
				return 1;
			}
			if (a.produto < b.produto) {
				return -1;
			}
		});

		const mostSellers = [];
		product_uniques.forEach((x) => {
			mostSellers.push(`${x.produto} - ${x.qnt}`)
		});

		res.send(mostSellers);

		logger.info("GET /delivery/MostSellers/get");
	} catch (err) {
		next(err);
	}
}

export default {
	createOrder,
	updateOrder,
	updateDeliverOrder,
	deleteOrder,
	getOrders,
	getOrder,
	getOrderAmountPerClient,
	getOrderTotalValuePerClient,
	getProductAmount,
	getProductTotalValue,
	getMostSellers
}
