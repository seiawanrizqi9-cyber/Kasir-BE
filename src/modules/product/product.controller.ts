import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  // ✅ GET ALL
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAllProducts(req.query as any);

      res.json({
        success: true,
        message: "Berhasil mengambil data produk",
        ...result,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ GET BY ID
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };

      const product = await this.service.getProductById(id);

      res.json({
        success: true,
        message: "Produk ditemukan",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ GET BY CODE (barcode / internal)
  getByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params as { code: string };

      const product = await this.service.getProductByCode(code);

      res.json({
        success: true,
        message: "Produk ditemukan",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ CREATE
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.service.createProduct(req.body);

      res.status(201).json({
        success: true,
        message: "Produk berhasil dibuat",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ UPDATE
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };

      const product = await this.service.updateProduct(id, req.body);

      res.json({
        success: true,
        message: "Produk berhasil diupdate",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  };

  // ✅ DELETE
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };

      await this.service.deleteProduct(id);

      res.json({
        success: true,
        message: "Produk berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  };

  // 🔥 FITUR KASIR
  calculate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items } = req.body;

      const result = await this.service.calculateTotal(items);

      res.json({
        success: true,
        message: "Perhitungan berhasil",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
