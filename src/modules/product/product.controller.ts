import { Request, Response, NextFunction } from "express";
import { ProductService } from "#/modules/product/product.service";
import { ResponseUtil } from "#/utils/response";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

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

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.productService.deleteProduct(req.params["id"] as string);
      return ResponseUtil.success(res, "Produk berhasil dihapus");
    } catch (error) {
      return next(error);
    }
  };

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
