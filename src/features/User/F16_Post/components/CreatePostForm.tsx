// src/features/User/F16_Post/components/CreatePostForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Loader2, Plus, AlertCircle } from "lucide-react";

import { createPost } from "../api";
import { getAllTags } from "../../../Common/F5_FilterByTag/api";
import axios from "../../../../lib/axios";

import { Card } from "../../../../components/ui/card";
import type { AxiosError } from "axios";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import type { CreatePostPayload } from "../types";
import type { Category, Tag } from "../../../../types";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Judul wajib diisi")
    .max(255, "Judul maksimal 255 karakter"),
  body: Yup.string()
    .required("Konten wajib diisi")
    .min(10, "Konten minimal 10 karakter"),
  category_id: Yup.string().required("Kategori wajib dipilih"),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, "Pilih minimal 1 tag")
    .max(5, "Maksimal 5 tag"),
});

async function fetchCategories(): Promise<Category[]> {
  const response = await axios.get("/api/explore/categories");
  const data = response.data;
  return data.data || data;
}

export default function CreatePostForm() {
  const navigate = useNavigate();
  const [tagSearch, setTagSearch] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories-list"],
    queryFn: fetchCategories,
  });

  const { data: tagsData } = useQuery({
    queryKey: ["all-tags"],
    queryFn: getAllTags,
  });
  const allTags: Tag[] = (tagsData?.data?.data ||
    tagsData?.data ||
    []) as Tag[];

  const mutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: (res) => {
      navigate(`/posts/${res.data.id}`);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      body: "",
      category_id: "",
      tags: [] as string[],
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate({
        title: values.title,
        body: values.body,
        category_id: values.category_id,
        tags: values.tags,
      });
    },
  });

  const selectedTagIds = formik.values.tags;
  const selectedTagObjects = allTags.filter((t) =>
    selectedTagIds.includes(t.id),
  );

  const filteredTags = allTags.filter(
    (t) =>
      !selectedTagIds.includes(t.id) &&
      t.name.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      formik.setFieldValue(
        "tags",
        selectedTagIds.filter((id) => id !== tagId),
      );
    } else if (selectedTagIds.length < 5) {
      formik.setFieldValue("tags", [...selectedTagIds, tagId]);
      setTagSearch("");
    }
  };

  return (
    /* Jarak antar form dirapatkan menggunakan space-y-4 */
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* ── Title ── */}
      <div className="space-y-1.5">
        {/* Label dinaikkan ke text-base font-semibold */}
        <Label
          htmlFor="title"
          className="text-base font-semibold text-gray-200"
        >
          Judul Pertanyaan <span className="text-red-400">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Contoh: Bagaimana cara menggunakan React Query dengan Laravel?"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="h-11 bg-[#161618] border-[#2A2A2C] text-white  placeholder:text-gray-600 text-sm"
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {formik.errors.title}
          </p>
        )}
      </div>

      {/* ── Category ── */}
      <div className="space-y-1.5">
        {/* Label dinaikkan ke text-base font-semibold */}
        <Label
          htmlFor="category_id"
          className="text-base font-semibold text-gray-200"
        >
          Kategori <span className="text-red-400">*</span>
        </Label>
        <select
          id="category_id"
          name="category_id"
          value={formik.values.category_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="h-11 w-full rounded-md border border-[#2A2A2C] bg-[#161618] px-3 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors"
        >
          <option value="" disabled>
            Pilih kategori...
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {formik.touched.category_id && formik.errors.category_id && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {formik.errors.category_id}
          </p>
        )}
      </div>

      {/* ── Body ── */}
      <div className="space-y-1.5">
        {/* Label dinaikkan ke text-base font-semibold */}
        <Label htmlFor="body" className="text-base font-semibold text-gray-200">
          Detail Pertanyaan <span className="text-red-400">*</span>
        </Label>
        <textarea
          id="body"
          name="body"
          rows={8} /* Dikurangi dari 10 ke 8 agar tinggi form lebih seimbang */
          placeholder="Jelaskan pertanyaan kamu secara detail..."
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full rounded-md border border-[#2A2A2C] bg-[#161618] px-3 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-y min-h-45"
        />
        {formik.touched.body && formik.errors.body && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {formik.errors.body}
          </p>
        )}
      </div>

      {/* ── Tags ── */}
      <div className="space-y-2">
        {/* Label dinaikkan ke text-base font-semibold */}
        <Label className="text-base font-semibold text-gray-200">
          Tag <span className="text-red-400">*</span>
          <span className="text-xs text-gray-500 font-normal ml-2">
            ({selectedTagIds.length}/5)
          </span>
        </Label>

        {/* Selected tags */}
        {selectedTagObjects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTagObjects.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 px-2.5 py-1 h-auto gap-1 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-900 transition-colors"
                onClick={() => toggleTag(tag.id)}
              >
                #{tag.name}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Tag search input */}
        <div className="relative">
          <Input
            placeholder={
              selectedTagIds.length >= 5 ? "Maksimal 5 tag" : "Cari tag..."
            }
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            disabled={selectedTagIds.length >= 5}
            className="h-10 bg-[#161618] border-[#2A2A2C] text-white placeholder:text-gray-600 text-sm pl-8"
          />
          <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

          {/* Tag dropdown */}
          {tagSearch && filteredTags.length > 0 && (
            <Card className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto border-[#2A2A2C] bg-[#161618]">
              {filteredTags.slice(0, 10).map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-[#2A2A2C] hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color || "#D4AF37" }}
                  />
                  {tag.name}
                  {tag.usage_count !== undefined && (
                    <span className="text-xs text-gray-600 ml-auto">
                      {tag.usage_count} posts
                    </span>
                  )}
                </button>
              ))}
            </Card>
          )}
        </div>
        {formik.touched.tags && formik.errors.tags && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {formik.errors.tags}
          </p>
        )}
      </div>

      {/* ── Error from API ── */}
      {mutation.isError && (
        <Card className="border-red-900 bg-red-950/30 p-4 my-2">
          <p className="text-sm text-red-400">
            {(
              (mutation.error as AxiosError)?.response?.data as {
                message: string;
              }
            )?.message ||
              "Gagal membuat postingan. Pastikan kamu memiliki minimal 15 poin."}
          </p>
        </Card>
      )}

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pt-3 justify-start">
        <Button
          type="submit"
          disabled={mutation.isPending || !formik.isValid}
          className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold text-sm px-5 py-2.5 h-auto rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)]"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Memposting...
            </>
          ) : (
            "Buat Pertanyaan"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          className="border-[#2A2A2C] text-gray-400 hover:text-white hover:bg-[#1A1A1C] hover:border-gray-600 font-semibold text-sm px-5 py-2.5 h-auto rounded-full transition-colors cursor-pointer"
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
