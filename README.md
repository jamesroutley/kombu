# Kombu

Kombu simplifies interacting with tabulated CLI data. Pipe the output of a shell command to `kombu`, and apply javascript functions to it. It's like using `awk`, without having to learn `awk`.

## Example

```shell
ls | kb "data.map((n) => n.concat(' ✨'))"
README.md ✨
node_modules ✨
package.json ✨
src ✨
yarn.lock ✨
```

Many shell commands output tabulated data:

```shell
$ df
Filesystem    512-blocks      Used Available Capacity iused      ifree %iused  Mounted on
/dev/disk1     487653376 110844640 376296736    23%  876686 4294090593    0%   /
devfs                370       370         0   100%     640          0  100%   /dev
```

Tabulated data piped to `kombu` (which I've aliased to `kb`) is read into a 2D array named `data`. The user supplies javascript statements to transform the data. In this example, the full data set is returned by supplying the statement `data`, and `kb` logs it automatically.

```shell
$ df | kb "data"
Filesystem 512-blocks Used Available Capacity iused ifree %iused Mounted on
/dev/disk1 487653376 110841568 376299808 23% 876685 4294090594 0% /
devfs 370 370 0 100% 640 0 100% /dev
```

Say we want to get a list of File System  names. First, we slice `data` to remove the columb titles (note kombu can remove titles automatically with the `-t, --title` [flag](#api)):

```shell
$ df | kb "data.slice(1)"
/dev/disk1 487653376 110841896 376299480 23% 876666 4294090613 0% /
devfs 370 370 0 100% 640 0 100% /dev
```

Then, we apply a `map` to the array to select the first element of each row:

```shell
$ df | kb "data.slice(1)" | kb "data.map((d) => d[0])"
/dev/disk1
devfs
```

## IO

Kombu aims to provide an intuitive experience. The type of `data` should be
what you intuitively expect it to be:

- single strings -> strings
- 1D lists -> array
- 2D tables -> nested array

Likewise, output is printed in a sensible format.

## API

```
Usage: <command> | kombu [options] statement

Kombu is a command-line tool for manipulating tabulated data.

Tabulated data should be piped to kombu, and a statement which transforms the
data should be supplied. The data is parsed, and made available to the statment
via the variable 'data'.

Options:
    -h, --help          Show this message and exit
    -t, --title         Remove titles, assumed to be at row 0
```

## Install

With `npm`:

```
$ npm install -g kombu
```

## Alternatives

- [awk](https://www.gnu.org/software/gawk/)
- [FuncShell](https://github.com/iostreamer-X/FuncShell), which kombu was inspired by
