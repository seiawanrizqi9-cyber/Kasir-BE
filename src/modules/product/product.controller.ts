import { Request, Response, NextFunction } from "express";
import { ProductService } from "#/modules/product/product.service";
import { ResponseUtil } from "#/utils/response";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * @swagger
   * /api/products:
   *   get:
   *     tags: [Products]
   *     summary: Ambil semua produk (dengan pagination & pencarian)
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: categoryId
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Daftar produk berhasil diambil
   */
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        page: req.query["page"]
          ? parseInt(req.query["page"] as string)
          : undefined,
        limit: req.query["limit"]
          ? parseInt(req.query["limit"] as string)
          : undefined,
        search: req.query["search"] as string | undefined,
        categoryId: req.query["categoryId"] as string | undefined,
      };
      const products = await this.productService.getAllProducts(filters);
      return ResponseUtil.success(res, "Produk berhasil diambil", products);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Ambil produk berdasarkan ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Detail produk
   *       404:
   *         description: Produk tidak ditemukan
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.getProductById(
        req.params["id"] as string,
      );
      return ResponseUtil.success(res, "Produk berhasil diambil", product);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products/serial/{serialNumber}:
   *   get:
   *     tags: [Products]
   *     summary: Ambil produk berdasarkan nomor seri
   *     parameters:
   *       - in: path
   *         name: serialNumber
   *         required: true
   *         schema:
   *           type: string
   *         description: Nomor seri unik produk
   *     responses:
   *       200:
   *         description: Detail produk ditemukan
   *       404:
   *         description: Produk tidak ditemukan
   */
  getBySerialNumber = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const product = await this.productService.getProductBySerialNumber(
        req.params["serialNumber"] as string,
      );
      return ResponseUtil.success(res, "Produk berhasil ditemukan", product);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products:
   *   post:
   *     tags: [Products]
   *     summary: Tambah produk baru
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - serialNumber
   *               - price
   *               - categoryId
   *             properties:
   *               name:
   *                 type: string
   *               serialNumber:
   *                 type: string
   *               price:
   *                 type: number
   *               categoryId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Produk berhasil ditambahkan
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.createProduct(
        req.body as {
          name: string;
          serialNumber: string;
          price: number;
          categoryId: string;
        },
      );
      return ResponseUtil.created(res, "Produk berhasil ditambahkan", product);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     tags: [Products]
   *     summary: Update produk
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               serialNumber:
   *                 type: string
   *               price:
   *                 type: number
   *               categoryId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Produk berhasil diupdate
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.updateProduct(
        req.params["id"] as string,
        req.body as {
          name?: string;
          serialNumber?: string;
          price?: number;
          categoryId?: string;
        },
      );
      return ResponseUtil.success(res, "Produk berhasil diupdate", product);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     tags: [Products]
   *     summary: Hapus produk
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Produk berhasil dihapus
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.deleteProduct(req.params["id"] as string);
      return ResponseUtil.success(res, "Produk berhasil dihapus");
    } catch (error) {
      return next(error);
    }
  };

  /**
   * @swagger
   * /api/products/calculate:
   *   post:
   *     tags: [Products]
   *     summary: Hitung total harga otomatis dari daftar nomor seri
   *     description: Kirim daftar nomor seri beserta jumlahnya, API akan mengembalikan detail harga dan grand total secara otomatis.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - items
   *             properties:
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - serialNumber
   *                     - qty
   *                   properties:
   *                     serialNumber:
   *                       type: string
   *                     qty:
   *                       type: integer
   *                       minimum: 1
   *     responses:
   *       200:
   *         description: Hasil perhitungan total harga
   */
  calculate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items } = req.body as {
        items: Array<{ serialNumber: string; qty: number }>;
      };
      const result = await this.productService.calculateTotal(items);
      return ResponseUtil.success(res, "Total harga berhasil dihitung", result);
    } catch (error) {
      return next(error);
    }
  };
}
