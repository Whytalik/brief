import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function badRequest(message = "Некоректний запит") {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Неавторизовано") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Доступ заборонено") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = "Не знайдено") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function tooManyRequests() {
  return NextResponse.json(
    { error: "Забагато запитів. Спробуйте пізніше." },
    { status: 429 },
  );
}

export function internalError() {
  return NextResponse.json(
    { error: "Внутрішня помилка сервера" },
    { status: 500 },
  );
}
