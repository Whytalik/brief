"use client";

import { TextInput } from "@/components/form/inputs/TextInput";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import {
  FieldArrayPath,
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

interface RepeatingFieldsetProps<T extends FieldValues> {
  name: FieldArrayPath<T>;
  label: string;
}

export function RepeatingFieldset<T extends FieldValues>({
  name,
  label,
}: RepeatingFieldsetProps<T>) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<T>();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const fieldErrors = errors[name] as unknown as Record<
    number,
    Record<string, { message?: string }>
  >;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            append({ name: "", role: "", contact: "" } as PathValue<
              T,
              FieldArrayPath<T>
            >[number])
          }
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Додати учасника
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 pt-8 shadow-sm sm:grid-cols-3"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              className="absolute right-2 top-2 h-8 w-8 rounded-full p-0 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <TextInput
              label="Ім'я"
              id={`${name}.${index}.name`}
              placeholder="Іван Іванов"
              {...register(`${name}.${index}.name` as Path<T>)}
              error={fieldErrors?.[index]?.name?.message}
              required
            />
            <TextInput
              label="Роль"
              id={`${name}.${index}.role`}
              placeholder="CEO / Project Manager"
              {...register(`${name}.${index}.role` as Path<T>)}
              error={fieldErrors?.[index]?.role?.message}
              required
            />
            <TextInput
              label="Контакт"
              id={`${name}.${index}.contact`}
              placeholder="Email або Telegram"
              {...register(`${name}.${index}.contact` as Path<T>)}
              error={fieldErrors?.[index]?.contact?.message}
              required
            />
          </div>
        ))}

        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">
              Стейкхолдери не додані. Натисніть &quot;Додати&quot;, щоб вказати контактну
              особу.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
