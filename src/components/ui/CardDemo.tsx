import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

interface CardDemoType {
  title: string;
  desc: string;
  actionText: string;
  actionUrl?: string;
  btnText: string;
  btnUrl?: string;
}

export function CardDemo({
  title,
  desc,
  actionText,
  actionUrl,
  btnText,
  btnUrl,
}: CardDemoType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
        <CardAction>{actionText}</CardAction>
      </CardHeader>
      <CardContent>
        <p>{btnText}</p>
      </CardContent>
      <CardFooter>
        <p></p>
      </CardFooter>
    </Card>
  );
}
