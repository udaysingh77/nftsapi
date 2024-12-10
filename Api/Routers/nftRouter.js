const express = require("express")

const nftController = require("../Controllers/nftController")
const router = express.Router()


router.route("/").get(nftController.getAllNfts).post(nftController.createNfts);

router.route(":/").get(nftController.getNft);

module.exports = router;